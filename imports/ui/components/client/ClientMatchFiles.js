import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Alert from '/imports/ui/alert';
import { read } from 'fs';

// function CreateNoteForm({ onCreateNote }) {
//   const [note, setNote] = useState('');
//   const [emailTitle, setEmailTitle] = useState('');
//   const [emailRecipients, setEmailRecipients] = useState('');
//   const [sendByEmail, setSendByEmail] = useState(false);

//   function handleSendByEmail() {
//     setSendByEmail(!sendByEmail);
//   }

//   return (
//     <form>
//       <p><strong>New Note</strong></p>
//       <div className="form-group">
//         <textarea
//           className="form-control"
//           onChange={e => setNote(e.target.value)}
//           value={note}
//         />
//         <div className="checkbox">
//           <label>
//             <input
//               type="checkbox"
//               checked={sendByEmail}
//               onChange={() => handleSendByEmail()}
//             /> Send note by email
//           </label>
//         </div>
//           {
//             sendByEmail ?
//               <div>
//                 <label>Email title</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={emailTitle}
//                   onChange={e => setEmailTitle(e.target.value)}
//                 />
//                 <label>Recipients</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="separate emails by comma"
//                   value={emailRecipients}
//                   onChange={e => setEmailRecipients(e.target.value)}
//                 />
//               </div>
//             :
//             null
//           }
//       </div>
//       <button
//         type="submit"
//         className="btn btn-default"
//         onClick={e => {
//           e.preventDefault();
//           onCreateNote({
//             note,
//             sendByEmail,
//             emailTitle: sendByEmail ? emailTitle : '',
//             emailRecipients: sendByEmail ? emailRecipients.split(',') : [],
//           });
//           setNote('');
//           setEmailTitle('');
//           setEmailRecipients('');
//         }}
//       >Create Note</button>
//     </form>
//   );
// }

export default function ClientMatchFiles({ dedupClientId, matchId, step, files }) {
  const [lastDataFetch, setLastDataFetch] = useState(new Date());
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [downloading, setDownloading] = useState({});
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const resourcePath = `matching/${matchId}/${step}/`;
    Meteor.call('s3bucket.listClientFiles', dedupClientId, resourcePath, (err, res) => {
      if (err) {
        Alert.error(err);
        setUploadedFiles({});
      } else {
        setUploadedFiles(res.Contents.reduce((all, file) => {
          const fileName = file.Key.substring(res.Prefix.length);
          const match = fileName.match(/(.+)\.(.+)/);
          if (!match) return all;
          const id = match[1];
          return {
            ...all,
            [id]: { uploaded: true, file: { name: fileName } },
          };
        }, {}));
      }
    });
  }, [lastDataFetch]);

  function handleFileChange(event, fileId) {
    setUploadedFiles({
      ...uploadedFiles,
      [fileId]: {
        file: event.target.files[0],
        uploaded: false,
      },
    });
  }

  function handleFileDownload(id) {
    setDownloading({
      ...downloading,
      [id]: true,
    });
    const name = uploadedFiles[id].file.name;
    const resourcePath = `matching/${matchId}/${step}/${name}`;
    Meteor.call('s3bucket.getClientFile', dedupClientId, resourcePath,
    (err, base64data) => {
      console.log('got file. size: ', base64data.length);
      setDownloading({
        ...downloading,
        [id]: false,
      });
      if (err) {
        Alert.error(err);
      } else {
        const uriContent = `data:application/octet-stream;base64,${base64data}`;
        const link = document.createElement('a');
        link.download = uploadedFiles[id].file.name;
        link.href = uriContent;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  function handleFileUpload(id) {
    setUploading({
      ...uploading,
      [id]: true,
    });

    let ext;
    try {
      ext = `.${uploadedFiles[id].file.name.match(/(.+)\.(.+)/)[2]}`;
    } catch (err) {
      ext = '';
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resourcePath = `matching/${matchId}/${step}/${id}${ext}`;
      const base64data = reader.result.split(',')[1];
      console.log('file loaded, uploading');
      Meteor.call('s3bucket.uploadClientFile', dedupClientId, resourcePath, base64data,
        (err) => {
          console.log('upload complete');
          setUploading({
            ...uploading,
            [id]: false,
          });
          if (err) {
            Alert.error(err);
          } else {
            Alert.success(`${files[id].label} uploaded`);
            setLastDataFetch(new Date());
          }
        });
    };
    reader.readAsDataURL(uploadedFiles[id].file); // readAsBinaryString
  }

  function handleFileRemove(id) {
    setUploading({
      ...uploading,
      [id]: true,
    });

    let ext;
    try {
      ext = `.${uploadedFiles[id].file.name.match(/(.+)\.(.+)/)[2]}`;
    } catch (err) {
      ext = '';
    }
    const resourcePath = `matching/${matchId}/${step}/${id}${ext}`;

    Meteor.call('s3bucket.deleteClientFile', dedupClientId, resourcePath,
    (err) => {
      setUploading({
        ...uploading,
        [id]: false,
      });
      if (err) {
        Alert.error(err);
      } else {
        Alert.success(`${files[id].label} deleted`);
        setLastDataFetch(new Date());
      }
    });
  }

  function cancelFileUpload(id) {
    setUploadedFiles(_.omit(uploadedFiles, id));
  }

  return (
    <div>
      <div><strong>Files</strong></div>
      <table className="table">
        <tbody>
          {Object.keys(files).map(id => (
            <tr key={id}>
              <td>
                {(uploadedFiles[id] || {}).uploaded ?
                  <React.Fragment>
                    <a
                      href="#"
                      title={uploadedFiles[id].file.name}
                      onClick={() => !downloading[id] && handleFileDownload(id)}
                    >
                      {files[id].label}
                    </a>
                    {downloading[id] && <i style={{ paddingLeft: 8 }} className="fa fa-cloud-download"></i>}
                  </React.Fragment>
                  :
                  files[id].label
                }
              </td>
              <td>
                {(uploadedFiles[id] || {}).uploaded ?
                  <button className="btn btn-danger" onClick={() => handleFileRemove(id)}>Remove</button>
                  :
                  <React.Fragment>
                    {(uploadedFiles[id] || {}).file ?
                      <React.Fragment>
                        {uploadedFiles[id].file.name}
                        <br />
                        <button
                          disabled={uploading[id]}
                          className="btn btn-primary"
                          onClick={() => handleFileUpload(id)}
                        >Upload</button>
                        <button
                          disabled={uploading[id]}
                          className="btn btn-default"
                          onClick={() => cancelFileUpload(id)}
                        >Cancel</button>
                      </React.Fragment>
                      :
                      <input
                        type="file"
                        name={id}
                        onChange={event => handleFileChange(event, id)}
                      />
                    }

                  </React.Fragment>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
