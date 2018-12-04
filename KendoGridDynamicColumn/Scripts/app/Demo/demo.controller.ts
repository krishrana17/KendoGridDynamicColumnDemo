namespace app.demo {
    'use strict';

    interface ProductHistoryViewModel {
        Columns: Array<ColumnMetaData>;
        RowValues: Array<any>;
        Total: number;
    }

    interface ColumnMetaData {
        FieldName: string;
        Width: number;
        Title: string;
        Format: string
        Align: string;
        IsVisible: boolean;
        DataType: string;
    }

    interface IDemoVm {
        BindCheckboxList(): void;
        UpdateGridColumn(): void;
    }

    export class DemoController implements IDemoVm {
        private $http: ng.IHttpService;
        private $filter: ng.IFilterService;
        private ColumnNames: Array<ColumnMetaData>;
        private gridColumns: Array<kendo.ui.GridColumn>;
        private mainGridOptions: kendo.ui.GridOptions;
        private isInfiniteScroll: boolean;

        constructor($http: ng.IHttpService, $filter: ng.IFilterService) {
            this.$http = $http;
            this.$filter = $filter;
            this.gridColumns = [];
            this.isInfiniteScroll = true;
            this.BindCheckboxList();
        };

        //Methis to bind column names with dropdown
        BindCheckboxList() {
            this.$http.get('/Home/BindCheckboxList').success(
                (data: ProductHistoryViewModel, status: any) => this.ColumnNames = data.Columns
            ).then(() => {
                this.UpdateGridColumn();
            });
        };

        FormatValue = (value: any, colMetaData: ColumnMetaData) => {
            var retVal: any;
            if (colMetaData.DataType.toLowerCase() === "date") {
                retVal = this.$filter('date')(new Date(value), colMetaData.Format);
            } else if (colMetaData.DataType.toLowerCase() === "currency") {
                retVal = this.$filter('currency')(value);
            } else if (colMetaData.DataType.toLowerCase() === "number") {
                retVal = this.$filter('number')(value);
            } else {
                retVal = value;
            }
            return retVal;
        };

        //Method to Generate/Update grid as per parameter
        UpdateGridColumn = () => {
            this.gridColumns = [];
            angular.forEach(this.ColumnNames, (val, key) => {
                if (val.IsVisible) {
                    this.gridColumns.push({
                        field: val.FieldName,
                        title: val.Title,
                        format: val.Format,
                        width: val.Width,
                        type: 'object',
                        template: "<div style='text-align:" + val.Align + "'>{{ dCtrl.FormatValue(dataItem['" + val.FieldName.toLowerCase() + "'], " + angular.toJson(val) + ") }}</div>"
                    });
                }
            });

            this.mainGridOptions = {
                dataSource: this.gridDataSource,
                selectable: false,
                editable: "inline",
                sortable: true,
                pageable: !this.isInfiniteScroll,
                resizable: true,
                columns: this.gridColumns,
                height: '700px',
                scrollable: {
                    virtual: this.isInfiniteScroll
                }
            };
        };

        gridDataSource: kendo.data.DataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: (e: kendo.data.DataSourceTransportOptions) => {
                    this.$http({ method: 'POST', url: 'BindMedicationDataAngular', data: { request: e.data, moduleId: 1, columnNames: this.ColumnNames } }).
                        success((data: any, status: any, headers: any, config: any) => {
                            e.success(data);
                        }).
                        error((data: any, status: any, headers: any, config: any) => {
                            alert('something went wrong');
                        });
                },
            },
            pageSize: 30,
            schema: {
                model: {
                    id: "iid"
                },
                data: "Data",
                total: "Total"
            },
            serverPaging: true,
            serverSorting: true
        });

        ToggleSelectAll = (selectAll: boolean) => {
            angular.forEach(this.ColumnNames, (val, key) => {
                val.IsVisible = selectAll;
            });
        };
    }
    angular.module('app.demo').controller('DemoController', DemoController);
}
