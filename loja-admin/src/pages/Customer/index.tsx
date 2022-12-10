import { useEffect, useState } from "react";

//UI
import { ColumnActionsMode, ComboBox, Dropdown, IColumn, IDropdownOption, Panel, PanelType, SelectionMode, ShimmeredDetailsList, Stack, Text, TextField } from "@fluentui/react";

//API
import { deleteCustomer, listCustomers, updateCustomer } from "../../services/server";

//TYPES
import { ICustomer } from "@typesCustom";


import { DetailsListOptions } from "../../components/DetailsListOptions";
import { PanelFooterContent } from "../../components/PanelFooterContent";
import { PageToolBar } from "../../components/PageToolBar";
import { MessageBarCustom } from "../../components/MessageBarCustom";


export function CustomerPage() {

    //Entity
    const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);
    const [customers, setCustomers] = useState<ICustomer[]>([]);

    //States Messages
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Loading
    const [loading, setLoading] = useState(true);

    //Open/Close
    const [openPanel, setOpenPanel] = useState(false);

    //Estados
    const estados = [
        { key: 'AC', text: 'Acre'},
        { key: 'AL', text: 'Alagoas'},
        { key: 'AP', text: 'Amapá'},
        { key: 'AM', text: 'Amazonas'},
        { key: 'BA', text: 'Bahia'},
        { key: 'CE', text: 'Ceará'},
        { key: 'DF', text: 'Distrito Federal'},
        { key: 'ES', text: 'Espírito Santo'},
        { key: 'GO', text: 'Goiás'},
        { key: 'MA', text: 'Maranhão'},
        { key: 'MT', text: 'Mato Grosso'},
        { key: 'MS', text: 'Mato Grosso do Sul'},
        { key: 'MG', text: 'Minas Gerais'},
        { key: 'PA', text: 'Pará'},
        { key: 'PB', text: 'Paraíba'},
        { key: 'PR', text: 'Paraná'},
        { key: 'PE', text: 'Pernambuco'},
        { key: 'PI', text: 'Piauí'},
        { key: 'RJ', text: 'Rio de Janeiro'},
        { key: 'RN', text: 'Rio Grande do Norte'},
        { key: 'RS', text: 'Rio Grande do Sul'},
        { key: 'RO', text: 'Rondônia'},
        { key: 'RR', text: 'Roraima'},
        { key: 'SC', text: 'Santa Catarina'},
        { key: 'SP', text: 'São Paulo'},
        { key: 'SE', text: 'Sergipe'},
        { key: 'TO', text: 'Tocantins'}
    ]

    //Columns
    const columns: IColumn[] = [
        {
            key: 'name', 
            name: 'Nome da Cliente', 
            fieldName: 'name', 
            minWidth: 200, 
            isResizable: false,
            columnActionsMode:  ColumnActionsMode.disabled
        },
        {
            key: 'uid', 
            name: 'UID', 
            fieldName: 'uid', 
            minWidth: 300, 
            maxWidth: 300,  
            isResizable: false,
            columnActionsMode:  ColumnActionsMode.disabled
        },
        {
            key: 'city', 
            name: 'Cidade', 
            fieldName: 'city', 
            minWidth: 200,  
            isResizable: false,
            columnActionsMode:  ColumnActionsMode.disabled
        },
        {
            key: 'state', 
            name: 'Estado', 
            fieldName: 'state',  
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: false,
            columnActionsMode:  ColumnActionsMode.disabled
        },
        { 
            key: 'option', 
            name: 'Opções', 
            minWidth: 60, 
            maxWidth: 60, 
            isResizable: false,
            columnActionsMode:  ColumnActionsMode.disabled,
            onRender: (item: ICustomer) => (
                <DetailsListOptions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)} />
            )
        },
    ];

    useEffect(() => {

        listCustomers()
            .then(result => {
                setCustomers(result.data);
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
            <PanelFooterContent 
                id={customer.id as number}
                loading={loading}
                onConfirm={handleConfirmSave}
                onDismiss={() => setOpenPanel(false)} />
        );
    }

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }
    
    function handleNew() {
        setCustomer({
            name: ''
        });
        setOpenPanel(true);
    }
    function handleEdit(item: ICustomer) {
        setCustomer(item);
        setOpenPanel(true);
    }
    function handleDelete(customer: ICustomer) {
        setLoading(true);
        
        deleteCustomer(Number(customer.id))
            .then(() => {
                const filteredTasks = customers.filter(itemFilter => itemFilter.id !== customer.id);
                setCustomers([...filteredTasks])
                setMessageSuccess('Registro excluído com sucesso');
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
                setLoading(false);
            });  
    }
    function handleConfirmSave() {
        
        setLoading(true);
        
        updateCustomer(customer).then(result => {
            const filteredTasks = customers.filter(itemFilter => itemFilter.id !== customer.id);
            setCustomers([...filteredTasks, result.data])
            setMessageSuccess('Registro salvo com sucesso');
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
        })
    }
    const handleSelectUF = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any>): void => {
        setCustomer({ ...customer, state: String(option.key) })
    }

    return (
        <div id="customer-page" className="main-content">
            <Stack horizontal={false} tokens={{childrenGap: 0}}>
                <PageToolBar
                    currentPageTitle="Clientes"
                    loading={true}
                    onNew={() => {}} />

                <MessageBarCustom 
                    messageError={messageError}
                    messageSuccess={messageSuccess}
                    onDismiss={() => handleDemissMessageBar()} />
                
                <div className="data-list">
                    <ShimmeredDetailsList
                        items={customers.sort((a, b) => (a.name > b.name ? 1 : -1))}
                        columns={columns}
                        setKey="set"
                        enableShimmer={loading}
                        selectionMode={SelectionMode.none} />
                    
                        {customers.length == 0 && (
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
                headerText="Cadastro de Cliente"
                onDismiss={() => setOpenPanel(false)}
                isFooterAtBottom={true}
                onRenderFooterContent={onRenderFooterContent}>

                <p>Preencha TODOS os campos obrigatórios identificados por <span className="required">*</span></p>

                <Stack horizontal={false} className="panel-form-content">
                
                    <TextField label="Nome do cliente"
                        required
                        value={customer.name}
                        onChange={event => setCustomer({ ...customer, name: (event.target as HTMLInputElement).value })} />

                    <TextField label="UID"
                        required
                        value={customer.uid} 
                        disabled/>   
                
                    <TextField label="Endereço"
                        required
                        value={customer.address}
                        onChange={event => setCustomer({ ...customer, address: (event.target as HTMLInputElement).value })} /> 

                    <TextField label="Cidade"
                        required
                        value={customer.city}
                        onChange={event => setCustomer({ ...customer, city: (event.target as HTMLInputElement).value })} />

                    <Dropdown
                        label="Estado"
                        options={estados}
                        styles={{
                                dropdown: { width: 160 }
                        }}
                        defaultSelectedKey={customer.state}
                        onChange={handleSelectUF as any} />

                </Stack>

            </Panel>
        </div>
    )
}