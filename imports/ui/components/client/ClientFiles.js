import React, { useState, useEffect } from 'react';
import Alert from '/imports/ui/alert';
import { formatDateTime } from '/imports/both/helpers';


const File = ({ dedupClientId, id, name, path, lastModified }) => {
  function handleFileDownload() {
    Meteor.call('s3bucket.getClientFileDownloadLink', dedupClientId, path,
    (err, downloadLink) => {
      if (err) {
        Alert.error(err);
      } else {
        window.location = downloadLink;
      }
    });
  }

  return (
    <React.Fragment>
      <div style={{ float: 'right' }}>
        <div className="dropdown">
          <button
            className="btn btn-default dropdown-toggle"
            type="button"
            id={`dropdownMenu${id}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
          >
            <i className="fa fa-cog" style={{ marginRight: 4 }}></i>
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" aria-labelledby={`dropdownMenu${id}`}>
            <li><a href="#" onClick={() => {}}>Edit</a></li>
            <li role="separator" className="divider"></li>
            <li><a href="#" onClick={() => {}}>Delete</a></li>
          </ul>
        </div>
      </div>
      <h4 className="list-group-item-heading">
        <a href="#" onClick={() => handleFileDownload()}>{name}</a>
      </h4>
      <p className="list-group-item-text">{path}</p>
      <div style={{ fontSize: '80%', color: 'gray', marginTop: 10 }}>
        Last modified on {formatDateTime(lastModified)}
      </div>
    </React.Fragment>
  );
};


export default function ClientFiles({ client }) {
  const dedupClientId = client.dedupClientId;

  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    const resourcePath = '';
    Meteor.call('s3bucket.listClientFiles', dedupClientId, resourcePath, (err, res) => {
      if (err) {
        Alert.error(err);
        setUploadedFiles({});
      } else {
        console.log(res.Contents);
        setUploadedFiles(res.Contents.reduce((all, file) => {
          const path = file.Key.substring(res.Prefix.length);
          const match = path.match(/(.+)\.(.+)/);
          if (!match) return all;
          const id = match[1];
          const name = id.split('/').pop();
          const lastModified = file.LastModified;
          return {
            ...all,
            [id]: { id, name, path, lastModified },
          };
        }, {}));
      }
    });
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <h3>Client Files</h3>
      </div>
      <ul className="list-group">
        {Object.values(uploadedFiles).map(f => (
          <li className="list-group-item" key={f.id}>
            <File
              id={f.id}
              name={f.name}
              path={f.path}
              lastModified={f.lastModified}
              dedupClientId={dedupClientId}
            />
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
