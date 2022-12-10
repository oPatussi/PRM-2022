import { useEffect, useState } from "react";

//UI
import { ColumnActionsMode, IColumn, Link, Panel, PanelType, SelectionMode, ShimmeredDetailsList, Stack, Text, TextField } from "@fluentui/react";

//API
import { listUsers, createUser, deleteUser, updateUser } from "../../services/server";

//TYPES
import { IUser } from "@typesCustom";

import { DetailsListOptions } from "../../components/DetailsListOptions";
import { MessageBarCustom } from "../../components/MessageBarCustom";
import { PanelFooterContent } from "../../components/PanelFooterContent";
import { PageToolBar } from "../../components/PageToolBar";


export function UserPage() {

    //Entity
    const [user, setUser] = useState<IUser>({} as IUser);
    const [users, setUsers] = useState<IUser[]>([]);

    //Field Password 
    const [password, setPassword] = useState('');

    //States Messages
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Loading
    const [loading, setLoading] = useState(true);

    //Open/Close
    const [openPanel, setOpenPanel] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //Columns
    const columns: IColumn[] = [
        {
            key: 'col1',
            name: 'UID',
            fieldName: 'uid',
            minWidth: 100,
            maxWidth: 200,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },
        {
            key: 'col2',
            name: 'Nome do Usuário',
            fieldName: 'name',
            minWidth: 100,
            maxWidth: 180,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },
        {
            key: 'col3',
            name: 'E-mail',
            fieldName: 'email',
            minWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },
        {
            key: 'col4',
            name: 'Opções',
            minWidth: 60,
            maxWidth: 60,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IUser) => (
                <DetailsListOptions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)} />
            )
        },
    ];

    useEffect(() => {

        listUsers()
            .then(result => {
                setUsers(result.data);
            })
            .catch(error => {
                setMessageError(error.message);
                setInterval(() => {
                    setMessageError('');
                }, 10000);
            })
            .finally(() => {
                setLoading(false)
            })

    }, []);

    const onRenderFooterContent = (): JSX.Element => {
        return (
            <PanelFooterContent 
                id={user.uid as string}
                loading={loading}
                onConfirm={handleConfirmSave}
                onDismiss={() => setOpenPanel(false)} />
        );
    }

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }
    function handleShowPassword() {
        setShowPassword(true);
    }
    function handleNew() {
        setUser({
            name: '',
            email: '',
            password: ''
        });
        setShowPassword(true);
        setOpenPanel(true);
    }
    function handleEdit(item: IUser) {
        setUser(item);
        setOpenPanel(true);
        setShowPassword(false);
    }
    function handleDelete(item: IUser) {
        setLoading(true);
        
        deleteUser(item.uid || '')
            .then(() => {
                const filteredTasks = users.filter(itemFilter => itemFilter.uid !== item.uid);
                setUsers([...filteredTasks])
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

        //Se a senha
        if (password == '') {
            delete user.password;
        }

        let result = null;

        if (user.uid) {
            result = updateUser(user);
        } else {
            result = createUser(user);
        }

        result.then(result => {
            const filteredTasks = users.filter(itemFilter => itemFilter.uid !== user.uid);
            setUsers([...filteredTasks, result.data])
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

    return (
        <div id="user-page" className="main-content">
            <Stack horizontal={false} tokens={{ childrenGap: 0 }}>
                <PageToolBar
                    currentPageTitle="Usuários"
                    loading={loading}
                    onNew={handleNew} />

                <MessageBarCustom 
                    messageError={messageError}
                    messageSuccess={messageSuccess}
                    onDismiss={() => handleDemissMessageBar()} />

                <div className="data-list">
                    <ShimmeredDetailsList
                        items={users}
                        columns={columns}
                        setKey="set"
                        enableShimmer={loading}
                        selectionMode={SelectionMode.none} />

                    {!loading && users.length == 0 && (
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
                headerText="Cadastro de Marca"
                onDismiss={() => setOpenPanel(false)}
                isFooterAtBottom={true}
                onRenderFooterContent={onRenderFooterContent}>

                <p>Preencha TODOS os campos obrigatórios identificados por <span className="required">*</span></p>

                <Stack horizontal={false} className="panel-form-content">

                    <TextField label="Nome do usuário"
                        required
                        value={user.name}
                        onChange={event => setUser({ ...user, name: (event.target as HTMLInputElement).value })} />

                    <TextField label="E-mail"
                        required
                        value={user.email}
                        disabled={Boolean(user.uid)}
                        onChange={event => setUser({ ...user, email: (event.target as HTMLInputElement).value })} />

                    {user.uid && !showPassword && (
                        <Stack horizontalAlign="end" tokens={{ padding: 20 }}>
                            <Link onClick={handleShowPassword}>Alterar senha</Link>
                        </Stack>
                    )}

                    {showPassword && (
                        <TextField label="Senha"
                            required 
                            type="password"
                            value={user.password}
                            minLength={6}
                            onChange={event => setUser({ ...user, password: (event.target as HTMLInputElement).value })} />
                    )}
                    
                </Stack>
            </Panel>
        </div>
    )
}