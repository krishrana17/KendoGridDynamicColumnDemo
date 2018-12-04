using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KendoGridDynamicColumn.Models
{
    public class GridViewModel
    {
        public List<ColumnMetaDataInfo> Columns { get; set; }

        public List<ColumnInfo> RowValues { get; set; }
    }

    public class ColumnInfo
    {
        public string PatientName { get; set; }

        public decimal OrderAmount { get; set; }

        public int PatientAge { get; set; }

        public DateTime OrderDate { get; set; }

        //public KeyValuePair<string, ColumnMetaDataInfo> Column { get; set; }
    }

    public class ColumnMetaDataInfo
    {
        public string FieldName { get; set; }

        public int Width { get; set; }

        public string Caption { get; set; }

        public string Format { get; set; }

        public string Align { get; set; }

        public bool Display { get; set; }

        public Type DataType { get; set; }
    }

    public class ColumnMetaData
    {
        public string FieldName { get; set; }

        public int Width { get; set; }

        public string Title { get; set; }

        public string Format { get; set; }

        public string Align { get; set; }

        public bool IsVisible { get; set; }

        public string DataType { get; set; }
    }

    public class GridRequestParams
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public int skip { get; set; }
        public int take { get; set; }
        public List<Sort> sort { get; set; }
    }

    public class Sort
    {
        public string dir { get; set; }
        public string field { get; set; }
        public string compare { get; set; }
    }

}