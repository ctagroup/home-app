using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;
using SurveyPIT.DAL;
using SurveyPIT.Models;

namespace SurveyPIT.Controllers
{
    public class ImageUploadController : ApiController
    {
        private SurveyDBContext db = new SurveyDBContext();


        [HttpPost, Route("api/upload")]
        public async Task<HttpResponseMessage> Upload()//int clientSurveyId
        {
            HttpRequestMessage request = this.Request;
            if (!request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.UnsupportedMediaType));
            }

            string root = Classes.Utility.ImagesFolder; //System.Web.HttpContext.Current.Server.MapPath("~/App_Data/uploads");
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
                List<string> newFiles = new List<string>();
                int clientSurveyId =0;
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

                    newFile.MoveTo(fullName);
                    // get id from the first file
                    if (clientSurveyId == 0)
                    {
                        clientSurveyId = GetId(newName);
                    }
                    if (clientSurveyId>0)
                    {
                        Image image = new Image() { ClientId = 1, path = fileName, ClientSurveyId = clientSurveyId }; 
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
                CommonLib.ExceptionUtility.LogException(CommonLib.ExceptionUtility.Application.General, e, "Post Images");
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
