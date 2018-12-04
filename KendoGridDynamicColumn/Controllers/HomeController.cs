using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Web.Configuration;
using System.Web.Mvc;
using Dapper;
using Kendo.Mvc.Extensions;
using KendoGridDynamicColumn.Models;

namespace KendoGridDynamicColumn.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var gridViewModel = new GridViewModel()
            {
                Columns = new List<ColumnMetaDataInfo>()
                {
                    new ColumnMetaDataInfo
                        {
                            Caption = "Patient Name",
                            FieldName = nameof(ColumnInfo.PatientName),
                            Width = 50,
                            Display = true,
                            Format = "",
                            Align = "left",
                            DataType = typeof(string)
                            //DataType = Type.GetType("System.String")
                        },
                    new ColumnMetaDataInfo
                        {
                            Caption = "Order Amount",
                            FieldName = nameof(ColumnInfo.OrderAmount),
                            Width = 15,
                            Display = true,
                            Format = "{0:C2}",
                            Align = "right",
                            DataType = typeof(decimal)
                        },
                    new ColumnMetaDataInfo
                        {
                            Caption = "Patient Age",
                            FieldName = nameof(ColumnInfo.PatientAge),
                            Width = 15,
                            Display = false,
                            Format = "{0:N2}",
                            Align = "right",
                            DataType = typeof(int)
                        },
                    new ColumnMetaDataInfo
                        {
                            Caption = "Order Date",
                            FieldName = nameof(ColumnInfo.OrderDate),
                            Width = 20,
                            Display = true,
                            Format = "{0:MM/dd/yyyy}",
                            Align = "center",
                            DataType = Type.GetType("System.DateTime")
                        }
                },
                // Actual value to bind for each row
                RowValues = new List<ColumnInfo>()
                {
                    new ColumnInfo { PatientName = "Krishnraj Rana", OrderAmount = 100.1M, PatientAge = 25, OrderDate = new DateTime(2016, 11, 25) },
                    new ColumnInfo { PatientName = "Vishal Vagadia", OrderAmount = 200.1M, PatientAge = 35, OrderDate = new DateTime(2016, 11, 29) },
                    new ColumnInfo { PatientName = "Birju Patel", OrderAmount = 300, PatientAge = 30, OrderDate = new DateTime(2016, 11, 28) }
                }
            };

            return View(gridViewModel);
        }

        public ActionResult About()
        {
            return View();
        }
        
        public ActionResult Contact()
        {
            return View();
        }


        private List<ColumnMetaData> GetColumnMetaDataByName(int moduleId, string columnNames)
        {
            try
            {
                var oPara = new DynamicParameters();
                oPara.Add("@ModuleMasterId", moduleId, dbType: DbType.Int32);
                oPara.Add("@ColumnNames", columnNames, dbType: DbType.String);

                using (IDbConnection cn = new SqlConnection(WebConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString))
                {
                    return cn.Query<ColumnMetaData>("GetColumnMetaDataByName", oPara, commandType: System.Data.CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                return new List<ColumnMetaData>();
            }
        }


        public ActionResult LRLCAngular()
        {
            return View();
        }

        public ActionResult LRLCAngularEditable()
        {
            return View();
        }
        
    }
}