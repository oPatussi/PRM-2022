import { useEffect, useState } from "react";

//UI
import { ColumnActionsMode, IColumn, Panel, PanelType, SelectionMode, ShimmeredDetailsList, Stack, Text, TextField } from "@fluentui/react";

//API
import { listCategories, createCategory, deleteCategory, updateCategory } from "../../services/server";

//TYPES
import { ICategory } from "@typesCustom";


import { DetailsListOptions } from "../../components/DetailsListOptions";
import { PanelFooterContent } from "../../components/PanelFooterContent";
import { PageToolBar } from "../../components/PageToolBar";
import { MessageBarCustom } from "../../components/MessageBarCustom";


export function CategoryPage() {

    //Entity
    const [category, setCategory] = useState<ICategory>({} as ICategory);
    const [categories, setCategories] = useState<ICategory[]>([]);

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
            key: 'name', 
            name: 'Nome da Categoria', 
            fieldName: 'name', 
            minWidth: 100, 
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
            onRender: (item: ICategory) => (
                <DetailsListOptions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)} />
            )
        },
    ];

    useEffect(() => {

        listCategories()
            .then(result => {
                setCategories(result.data);
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
                id={category.id as number}
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
        setCategory({
            name: ''
        });
        setOpenPanel(true);
    }
    function handleEdit(item: ICategory) {
        setCategory(item);
        setOpenPanel(true);
    }
    function handleDelete(category: ICategory) {
        setLoading(true);
        
        deleteCategory(category.id || 0)
            .then(() => {
                const filteredTasks = categories.filter(itemFilter => itemFilter.id !== category.id);
                setCategories([...filteredTasks])
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
        let result = null;

        if (category.id) {
            result = updateCategory(category);
        } else {
            result = createCategory(category);
        }

        result.then(result => {
            const filteredTasks = categories.filter(itemFilter => itemFilter.id !== category.id);
            setCategories([...filteredTasks, result.data])
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
        <div id="category-page" className="main-content">
            <Stack horizontal={false} tokens={{childrenGap: 0}}>
                <PageToolBar
                    currentPageTitle="Categorias"
                    loading={loading}
                    onNew={handleNew} />

                <MessageBarCustom 
                    messageError={messageError}
                    messageSuccess={messageSuccess}
                    onDismiss={() => handleDemissMessageBar()} />
                
                <div className="data-list">
                    <ShimmeredDetailsList
                        items={categories.sort((a, b) => (a.name > b.name ? 1 : -1))}
                        columns={columns}
                        setKey="set"
                        enableShimmer={loading}
                        selectionMode={SelectionMode.none} />
                    
                        {categories.length == 0 && (
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
                headerText="Cadastro de Categoria"
                onDismiss={() => setOpenPanel(false)}
                isFooterAtBottom={true}
                onRenderFooterContent={onRenderFooterContent}>

                <p>Preencha TODOS os campos obrigatórios identificados por <span className="required">*</span></p>

                <Stack horizontal={false} className="panel-form-content">
                
                    <TextField label="Nome da categoria"
                        required
                        value={category.name}
                        onChange={event => setCategory({ ...category, name: (event.target as HTMLInputElement).value })} />

                </Stack>

            </Panel>
        </div>
    )
}