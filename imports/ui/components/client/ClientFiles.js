import React, { useState, useEffect } from 'react';
import Alert from '/imports/ui/alert';
import { formatDateTime } from '/imports/both/helpers';


const File = ({ dedupClientId, file, match, project }) => {
  function handleFileDownload() {
    Meteor.call('s3bucket.getClientFileDownloadLink', dedupClientId, file.path,
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
      <h4 className="list-group-item-heading">
        <a href="#" onClick={() => handleFileDownload()}>{file.name}</a>
      </h4>
      <p className="list-group-item-text">
        {project.projectName} (match {match.id}, step {file.path.split('/')[2]})
      </p>
      <div style={{ fontSize: '80%', color: 'gray', marginTop: 10 }}>
        Last modified on {formatDateTime(file.lastModified)}
      </div>
    </React.Fragment>
  );
};


export default function ClientFiles({ client }) {
  const dedupClientId = client.dedupClientId;

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    Meteor.call('matching.clientFiles', dedupClientId, (err, res) => {
      if (err) {
        Alert.error(err);
        setUploadedFiles([]);
      } else {
        setUploadedFiles(res);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <h3>Client Files</h3>
      </div>
      <ul className="list-group">
        {uploadedFiles.map(f => (
          <li className="list-group-item" key={f.file.path}>
            <File
              file={f.file}
              match={f.match}
              project={f.project}
              dedupClientId={dedupClientId}
            />
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
