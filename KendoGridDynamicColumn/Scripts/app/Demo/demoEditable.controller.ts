namespace app.demo {
    'use strict';

    interface MedicationHistoryViewModel {
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

    export class DemoEditableController implements IDemoVm {
        private $http: ng.IHttpService;
        private ColumnNames: Array<ColumnMetaData>;
        private gridColumns: Array<kendo.ui.GridColumn>;
        private mainGridOptions: kendo.ui.GridOptions;
        private isInfiniteScroll: boolean;

        constructor($http: ng.IHttpService) {
            this.$http = $http;
            this.gridColumns = [];
            this.isInfiniteScroll = true;
            this.BindCheckboxList();
        };

        types = [
            {
                "Type": "FB",
                "Name": "Facebook"
            },
            {
                "Type": "TW",
                "Name": "Twitter"
            },
            {
                "Type": "YT",
                "Name": "YouTube"
            },
            {
                "Type": "PI",
                "Name": "Pinterest"
            }
        ];

        //Methis to bind column names with dropdown
        BindCheckboxList() {
            this.$http.get('/Home/BindCheckboxList').success(
                (data: MedicationHistoryViewModel, status: any) => this.ColumnNames = data.Columns
            ).then(() => {
                this.UpdateGridColumn();
            });
        };

        //Method to Generate/Update grid as per parameter
        UpdateGridColumn = () => {
            this.gridColumns = [];
            angular.forEach(this.ColumnNames, (val, key) => {
                if (val.IsVisible) {
                    this.gridColumns.push({
                        field: val.FieldName,
                        minScreenWidth: 200,

                    });
                }
            });

            this.gridColumns[0].editor = (container, options) => {
                $('<input required kendo-date-time-picker data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
            };
            this.gridColumns[2].editor = (container, options) => {
                $('<input required data-text-field="Name" data-value-field="Type" data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoComboBox({
                        autoBind: false,
                        dataSource: new kendo.data.DataSource({
                            data: this.types
                        }),
                        //template: "<i class=\"fa fa-#=data.Name.toLowerCase()#\"></i> #=data.Name#"
                    });
            };
            this.gridColumns.push({
                command: ["edit", "destroy"],
                title: "#",
                width: "200px"
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
                update: (e: kendo.data.DataSourceTransportOptions) => {
                    console.dir(e);
                    e.success(e.data);
                }
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
    angular.module('app.demo').controller('DemoEditableController', DemoEditableController);
}
