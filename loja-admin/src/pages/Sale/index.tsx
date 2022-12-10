import { useEffect, useState } from "react";
import {FormattedDate, FormattedNumber, IntlProvider} from "react-intl";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

//UI
import {
    ColumnActionsMode,
    Dropdown,
    IColumn,
    IconButton,
    IDropdownOption,
    IIconProps,
    Panel,
    PanelType,
    Pivot,
    PivotItem, PrimaryButton,
    SelectionMode,
    ShimmeredDetailsList,
    Stack,
    Text,
    TooltipHost
} from "@fluentui/react";

//API
import {changeStatus, listSales } from "../../services/server";

//TYPES
import { ISale } from "@typesCustom";

//ICONS
const iconEdit: IIconProps = { iconName: 'Edit' };

//COMPONENTS
import { PageToolBar } from "../../components/PageToolBar";
import { MessageBarCustom } from "../../components/MessageBarCustom";

export function SalePage(){

    const statusPedido = [
        { key: 'Novo', text: 'Novo'},
        { key: 'Faturado', text: 'Faturado'},
        { key: 'Despachado', text: 'Despachado'},
        { key: 'Entregue', text: 'Entregue'}
    ]

    //Entity
    const [sale, setSale] = useState<ISale>({} as ISale);
    const [sales, setSales] = useState<ISale[]>([]);

    //States Messages
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Loading
    const [loading, setLoading] = useState(true);

    //Open/Close
    const [openPanel, setOpenPanel] = useState(false);

    //ProgressBarValue
    const [progressBarValue, setProgressBarValue] = useState(0)

    //Columns
    const columns: IColumn[] = [
        {
            key: 'id',
            name: 'Venda',
            fieldName: 'id',
            minWidth: 50,
            maxWidth: 50,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },{
            key: 'order',
            name: 'Pedido',
            fieldName: 'order',
            minWidth: 50,
            maxWidth: 50,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <span>{item.order.id}</span>
            )
        },
        {
            key: 'saleDate',
            name: 'Data Venda',
            fieldName: 'saleDate',
            minWidth: 80,
            maxWidth: 80,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
               <IntlProvider locale="pt-BR">
                    <FormattedDate value={item.saleDate} day="2-digit" month="2-digit" year="numeric" />
               </IntlProvider>
            )
        },
        {
            key: 'customer',
            name: 'Cliente',
            fieldName: 'customer',
            minWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <span>{item.order.customer.name}</span>
            )
        },
        {
            key: 'shipping',
            name: 'Frete',
            fieldName: 'shipping',
            minWidth: 80,
            maxWidth: 80,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <IntlProvider locale="pt-BR">
                    <FormattedNumber value={Number(item.order.shipping)} style="currency" currency="BRL" />
                </IntlProvider>
            )
        },
        {
            key: 'total',
            name: 'Total',
            fieldName: 'id',
            minWidth: 80,
            maxWidth: 80,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <IntlProvider locale="pt-BR">
                    <FormattedNumber value={item.total} style="currency" currency="BRL" />
                </IntlProvider>
            )
        },
        {
            key: 'status',
            name: 'Status',
            fieldName: 'status',
            minWidth: 100,
            maxWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <span>{item.order.status}</span>
            )
        },
        {
            key: 'option',
            name: 'Opções',
            minWidth: 90,
            maxWidth: 90,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: ISale) => (
                <Stack horizontal horizontalAlign="start">
                    <TooltipHost content="Visulaizar">
                        <IconButton iconProps={iconEdit}
                            onClick={() => handleEdit(item)} />
                    </TooltipHost>
                </Stack>
            )
        },
    ];

    useEffect(() => {

        listSales()
            .then(result => {
                setSales(result.data);
            })
            .catch(error => {
                setMessageError(error.message);
                setInterval(() => {
                    setMessageError('');
                }, 10000);
            })
            .finally(() => {
                setLoading(false)
            });

    }, []);

    const loadData = () => {
        listSales()
            .then(result => {
                setSales(result.data);
            })
            .catch(error => {
                setMessageError(error.message);
                setInterval(() => {
                    setMessageError('');
                }, 10000);
            })
            .finally(() => {
                setLoading(false)
            });
    }
    
    const onRenderFooterContent = (): JSX.Element => {
        return (
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <PrimaryButton onClick={handleChangeStatus}
                    disabled={loading}>
                    Alterar
                </PrimaryButton>
            </Stack>
        );
    }

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }

    function handleEdit(item: ISale) {
        setSale(item);
        setOpenPanel(true);
        changeProgressBarValue(item.order.status)
    }

    function handleChangeStatus() {
        setLoading(true)

        changeStatus(sale.order)
            .then(result => {
                loadData();

                setMessageSuccess('Status do pedido alterado com sucesso'); 
                setInterval(() => {
                    setMessageSuccess('');
                }, 5000);

            })
            .catch(error => {
                setMessageError(error.message);
                setInterval(() => {
                    setMessageError('');
                }, 10000);
            })
            .finally(() => {
                setOpenPanel(false);
                setLoading(false);
            });
    }

    function changeProgressBarValue(status: String) {
        if (status == 'Novo'){
            setProgressBarValue(0)
        }
        else if (status == 'Faturado'){
            setProgressBarValue(33)
        }
        else if (status == 'Despachado'){
            setProgressBarValue(66)
        }
        else if (status == 'Entregue'){
            setProgressBarValue(100)
        }
    }

    const handleSelectStatus = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any>): void => {
        setSale({...sale, order: {...sale.order, status: String(option.key)}})
        changeProgressBarValue(option.text)
    }


    return (
        <div id="order-page" className="main-content">
            
            
            <Stack horizontal={false} tokens={{ childrenGap: 0 }}>
                <PageToolBar
                    currentPageTitle="Vendas"
                    loading={true}
                    onNew={() => {}} />

                <MessageBarCustom
                    messageError={messageError}
                    messageSuccess={messageSuccess}
                    onDismiss={() => handleDemissMessageBar()} />

                <div className="data-list">
                    <ShimmeredDetailsList
                        items={sales}
                        columns={columns}
                        setKey="set"
                        enableShimmer={loading}
                        selectionMode={SelectionMode.none} />

                    {sales.length == 0 && (
                        <div className="data-not-found">
                            <Text variant="large">Nenhum registro para ser exibido!</Text>
                        </div>
                    )}

                </div>
            </Stack>

            <Panel
                className="panel-form"
                isOpen={openPanel}
                type={PanelType.medium}
                headerText="Alterar Status do Pedido"
                onDismiss={() => setOpenPanel(false)}
                isFooterAtBottom={true}
                onRenderFooterContent={onRenderFooterContent}>

                <p>Defina o status do pedido e clique em Alterar.</p>

                <Stack horizontal={false} className="panel-form-content">
                
                    <Dropdown
                        label="Status"
                        options={statusPedido}
                        styles={{
                                dropdown: { width: 160 }
                        }}
                        onChange={handleSelectStatus as any} />

                    
                </Stack>

                <Stack>
                    <ProgressBar now={progressBarValue} label="Status pedido"/>
                </Stack>

            </Panel>
        </div>
            )

    
}