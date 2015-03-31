using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using SurveyAdmin.Models;
using SurveyAdmin.Models.SurveyInfo;
using SurveyAdmin.Utilities;

namespace SurveyAdmin.Controllers.api
{
    public class ImageUploadController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpPost, Route("api/upload")]
        public async Task<HttpResponseMessage> Upload()//int clientSurveyId
        {
            HttpRequestMessage request = this.Request;
            if (!request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.UnsupportedMediaType));
            }

            string root = Utility.ImagesFolder; //System.Web.HttpContext.Current.Server.MapPath("~/App_Data/uploads");
            //validate if the upload folder exists. If not, create one
            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);
                var newFiles = new List<string>();
                var clientSurveyId =0;
                // Save each images files separately instead of a single multipart file
                foreach (MultipartFileData file in provider.FileData)
                {
                    //Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                    //Trace.WriteLine("Server file path: " + file.LocalFileName);
                    string fileName = file.Headers.ContentDisposition.FileName;
                    var newName = fileName;
                    var fullName = string.Empty;
                    var newFile = new FileInfo(file.LocalFileName);

                    if (fileName.Contains("\""))
                        newName =  fileName.Substring(1, fileName.Length - 2);

                    fullName = Path.Combine(root.ToString(), newName);

                    if (File.Exists(fullName))
                    {
                        File.Move(fullName, fullName + ".old");
                    }
                    newFile.MoveTo(fullName);
                    // get id from the first file
                    if (clientSurveyId == 0)
                    {
                        clientSurveyId = GetId(newName);
                    }
                    if (clientSurveyId > 0)
                    {
                        var clientSurvey = db.ClientSurveys.Find(clientSurveyId);

                        Image image = new Image() { path = fileName, ClientSurveyId = clientSurveyId, ClientId = clientSurvey.ClientId}; 
                        db.Images.Add(image);
                        newFiles.Add(newName);
                    }
                }
                //save image file name to image table in the database
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, newFiles.Count + " file(s) uploaded.");
            }
            catch (System.Exception e)
            {
                MvcApplication.Logger.Error("Uploading image", e);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        private int GetId(string name)
        {
            //image name <id>_a.jpg
            int index = name.IndexOf('_');
            string sId = "";
            int id = 0;
            if (index > 0)
            {
                sId = name.Substring(0, index);
                id = int.Parse(sId);
            }
            return id;
        }
    }
}
