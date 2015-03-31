using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SurveyAdmin.Startup))]
namespace SurveyAdmin
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
