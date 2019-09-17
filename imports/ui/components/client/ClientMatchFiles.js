import { Slingshot } from 'meteor/edgee:slingshot';
import React, { useState, useEffect } from 'react';
import Alert from '/imports/ui/alert';


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
    const name = uploadedFiles[id].file.name;
    const resourcePath = `matching/${matchId}/${step}/${name}`;
    Meteor.call('s3bucket.getClientFileDownloadLink', dedupClientId, resourcePath,
    (err, downloadLink) => {
      if (err) {
        Alert.error(err);
      } else {
        window.location = downloadLink;
      }
    });
  }

  function handleFileUpload(event, id) {
    event.preventDefault();

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

    const metaContext = {
      dedupClientId,
      matchId,
      step,
      fileId: id,
      ext,
    };
    const uploader = new Slingshot.Upload('referrals', metaContext);
    uploader.send(uploadedFiles[id].file, err => {
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
                          onClick={(event) => handleFileUpload(event, id)}
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
