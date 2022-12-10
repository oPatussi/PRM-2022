import { useEffect, useState } from "react";
import {FormattedDate, FormattedNumber, IntlProvider} from "react-intl";

//UI
import {
    ColumnActionsMode,
    IColumn,
    IconButton,
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
import { cancelOrder, createSale, listOrders } from "../../services/server";

//TYPES
import { IOrder } from "@typesCustom";

//ICONS
const iconEdit: IIconProps = { iconName: 'Edit' };
const iconInvoiced: IIconProps = { iconName: 'ShoppingCart' };
const iconCanceled: IIconProps = { iconName: 'Cancel' };

//COMPONENTS
import { PageToolBar } from "../../components/PageToolBar";
import { MessageBarCustom } from "../../components/MessageBarCustom";

export function OrderPage() {

    //Entity
    const [order, setOrder] = useState<IOrder>({} as IOrder);
    const [orders, setOrders] = useState<IOrder[]>([]);

    //States Messages
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Loading
    const [loading, setLoading] = useState(true);

    //Open/Close
    const [openPanel, setOpenPanel] = useState(false);

    //Columns
    const columns: IColumn[] = [
        {
            key: 'id',
            name: 'Pedido',
            fieldName: 'id',
            minWidth: 50,
            maxWidth: 50,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },
        {
            key: 'orderDate',
            name: 'Data Pedido',
            fieldName: 'orderDate',
            minWidth: 80,
            maxWidth: 80,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IOrder) => (
               <IntlProvider locale="pt-BR">
                    <FormattedDate value={item.orderDate} day="2-digit" month="2-digit" year="numeric" />
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
            onRender: (item: IOrder) => (
                <span>{item.customer.name}</span>
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
            onRender: (item: IOrder) => (
                <IntlProvider locale="pt-BR">
                    <FormattedNumber value={Number(item.shipping)} style="currency" currency="BRL" />
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
            onRender: (item: IOrder) => (
                <IntlProvider locale="pt-BR">
                    <FormattedNumber value={calculeteTotal( item )} style="currency" currency="BRL" />
                </IntlProvider>
            )
        },
        {
            key: 'option',
            name: 'Opções',
            minWidth: 90,
            maxWidth: 90,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IOrder) => (
                <Stack horizontal horizontalAlign="start">
                    <TooltipHost content="Visulaizar">
                        <IconButton iconProps={iconEdit}
                            onClick={() => handleView(item)} />
                    </TooltipHost>
                    <TooltipHost content="Cancelar">
                        <IconButton iconProps={iconCanceled}
                            onClick={handleCancel} />
                    </TooltipHost>
                    <TooltipHost content="Faturar">
                        <IconButton iconProps={iconInvoiced}
                            onClick={() => handleInvoice(item)} />
                    </TooltipHost>
                </Stack>
            )
        },
    ];

    useEffect(() => {

        listOrders()
            .then(result => {
                setOrders(result.data);
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

    const onRenderFooterContent = (): JSX.Element => {
        return (
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <PrimaryButton onClick={() => setOpenPanel(false)}
                    disabled={loading}>
                    Ok
                </PrimaryButton>
            </Stack>
        );
    }

    function calculeteTotal(data: IOrder) {
        let total = 0;
        let frete = Number(data.shipping);

        if (data.items && data.items.length > 0) {
            for (const orderItem of data.items) {
                total += orderItem.amount * orderItem.value;
            }
        }

        return total + frete;
    }

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }

    function handleView(item: IOrder) {
        setOrder(item);
        setOpenPanel(true)
    }
    function handleCancel() {
    }

    function handleInvoice(item: IOrder) {
        createSale(item)
            .then(result =>{
                const filteredTasks = orders.filter(itemFilter => itemFilter.id !== order.id);
                setOrders([...filteredTasks])
                setMessageSuccess('Venda efetuada com sucesso')
                setInterval(() => {
                    setMessageSuccess('');
                },5000);          
            })
            .catch(error => {console.log('aqui 2', error)
                setMessageError(error.message);
                setInterval(() => {
                    setMessageError('');
                },10000)
            });   
    }

    return (
            <div id="order-page" className="main-content">
                <Stack horizontal={false} tokens={{ childrenGap: 0 }}>
                    <PageToolBar
                        currentPageTitle="Pedidos à Faturar"
                        loading={true}
                        onNew={() => {}} />

                    <MessageBarCustom
                        messageError={messageError}
                        messageSuccess={messageSuccess}
                        onDismiss={() => handleDemissMessageBar()} />

                    <div className="data-list">
                        <ShimmeredDetailsList
                            items={orders}
                            columns={columns}
                            setKey="set"
                            enableShimmer={loading}
                            selectionMode={SelectionMode.none} />

                        {orders.length == 0 && (
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
                    headerText="Pedidos à Faturar"
                    onDismiss={() => setOpenPanel(false)}
                    isFooterAtBottom={true}
                    onRenderFooterContent={onRenderFooterContent}>

                    <p>Os dados do pedido não poderão ser alterados por aqui. Para alterar, é preciso cancelar o pedido e fazer um novo.</p>

                    <Stack horizontal={false} styles={{
                        root: {
                            marginTop: '24px'
                        }
                    }}>
                        {/*
                        <Pivot>
                        <PivotItem
                        headerText="Dados Gerais">
                        <Stack horizontal={false} className="panel-form-content">

                        <TextField label="Nome da produto"
                        required
                        value={order.name}
                        onChange={event => setOrder({ ...order, name: (event.target as HTMLInputElement).value })} />

                        <TextField label="Descrição"
                        multiline rows={3} resizable={false}
                        value={order.description}
                        onChange={event => setOrder({ ...order, description: (event.target as HTMLInputElement).value })} />

                        <Stack horizontal styles={{
                        root: {
                        justifyContent: 'space-between'
                        }
                        }}>
                        <TextField label="Preço"
                        required
                        styles={{
                        root: { width: 160 }
                        }}
                        type="number"
                        step={0.01}
                        value={String(order.price)}
                        prefix="R$ "
                        onChange={event => setOrder({ ...order, price: Number((event.target as HTMLInputElement).value) })} />

                        <Dropdown
                        label="Categoria"
                        required
                        options={categoryOptions}
                        styles={{
                        dropdown: { width: 160 }
                        }}

                        defaultSelectedKey={order.category?.id}
                        onChange={handleSelectCategory as any} />

                        <Dropdown
                        label="Marca"
                        options={brandOptions}
                        styles={{
                        dropdown: { width: 160 }
                        }}
                        defaultSelectedKey={order.brand?.id}
                        onChange={handleSelectBrand as any} />
                        </Stack>
                        <Toggle
                        inlineLabel
                        styles={{
                        root: {
                        marginTop: '10px !important'
                        }
                        }}
                        label="Produto ativo"
                        defaultChecked={order.active === 'S'}
                        onText="Sim"
                        offText="Não"
                        onChange={onChangeActive} />
                        </Stack>

                        </PivotItem>
                        <PivotItem
                        headerButtonProps={{
                        'disabled': !order.id,
                        'style': {
                        color: 'grey'
                        }
                        }}
                        headerText={order.images && order.images?.length == 0 ? 'Imagens' : `Imagens (${order.images?.length})`}>

                        <div className="images-content">
                        {!order.images && (
                        <div className="card-image-empty">
                        <img src={imgNoFiles} />
                        <Text variant="large">
                        Nenhuma foto encontrada!
                        </Text>
                        </div>
                        )}
                        <div className="card">

                        </div>
                        {order.images?.map(item => (
                        <div key={item.id} className="card card-image">
                        <img src={item.imageURL} />
                        </div>
                        ))}
                        </div>


                        </PivotItem>
                        </Pivot>
                        {*/}
                    </Stack>

                </Panel>
            </div>
            )
}