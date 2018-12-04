using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(KendoGridDynamicColumn.Startup))]
namespace KendoGridDynamicColumn
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
