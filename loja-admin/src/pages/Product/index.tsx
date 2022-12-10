import { useEffect, useState } from "react";
import { FormattedNumber, IntlProvider } from "react-intl";

//UI
import { ColumnActionsMode, Dropdown, IColumn, IDropdownOption, Panel, PanelType, Pivot, PivotItem, SelectionMode, ShimmeredDetailsList, Stack, Text, TextField, Toggle, TooltipHost } from "@fluentui/react";

//API
import { listProducts, createProduct, deleteProduct, updateProduct, listCategories, listBrands, getProductImages } from "../../services/server";

//TYPES
import { IBrand, ICategory, IProduct } from "@typesCustom";

//COMPONENTS
import { DetailsListOptions } from "../../components/DetailsListOptions";
import { PanelFooterContent } from "../../components/PanelFooterContent";
import { PageToolBar } from "../../components/PageToolBar";
import { MessageBarCustom } from "../../components/MessageBarCustom";

//IMAGES
import imgNoFiles from '../../assets/img/no-files.png';

export function ProductPage() {

    //Entity
    const [product, setProduct] = useState<IProduct>({} as IProduct);
    const [products, setProducts] = useState<IProduct[]>([]);

    //Options Dropbox
    const [brandOptions, setBradOptions] = useState<IDropdownOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<IDropdownOption[]>([]);

    //States Messages
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Loading
    const [loading, setLoading] = useState(true);

    //Open/Close
    const [openPanel, setOpenPanel] = useState(false);

    //Styles
    const styles = {
        active: {
            backgroundColor: '#4DB36F'
        },
        desactive: {
            backgroundColor: '#fb6565'
        }
    };

    //Columns
    const columns: IColumn[] = [
        {
            key: 'active',
            name: 'Ativo',
            fieldName: 'active',
            minWidth: 35,
            maxWidth: 35,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IProduct) => (
                <TooltipHost content={item.active == 'S' ? 'Ativo' : 'Inativo'}>
                    <div className="legend" style={item.active == 'S' ? styles.active : styles.desactive}></div>
                </TooltipHost>
            )
        },
        {
            key: 'name',
            name: 'Nome da Produto',
            fieldName: 'name',
            minWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        },
        {
            key: 'category',
            name: 'Categoria',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 150,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IProduct) => (
                <span>{item.category.name}</span>
            )
        },
        {
            key: 'brand',
            name: 'Marca',
            fieldName: 'brand',
            minWidth: 100,
            maxWidth: 120,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IProduct) => (
                <span>{item.brand ? item.brand.name : ''}</span>
            )
        },
        {
            key: 'price',
            name: 'Preço',
            fieldName: 'price',
            minWidth: 80,
            maxWidth: 120,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IProduct) => (
                <IntlProvider locale="pt-BR">
                    <FormattedNumber value={item.price} style="currency" currency="BRL" />
                </IntlProvider>
            )
        },
        {
            key: 'option',
            name: 'Opções',
            minWidth: 60,
            maxWidth: 60,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IProduct) => (
                <DetailsListOptions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)} />
            )
        },
    ];

    useEffect(() => {

        listProducts()
            .then(result => {
                setProducts(result.data);

                //Busca as categorias
                return listCategories();
            })
            .then(resultCategory => {
                let options = []

                for (const item of resultCategory.data as IBrand[]) {
                    options.push({
                        key: Number(item.id),
                        text: item.name
                    })
                }

                setCategoryOptions(options);

                //Busca as marcas
                return listBrands()
            })
            .then(resultBrand => {
                let options = []

                for (const item of resultBrand.data as IBrand[]) {
                    options.push({
                        key: Number(item.id),
                        text: item.name
                    })
                }

                setBradOptions(options);
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
                id={product.id as number}
                loading={loading}
                onConfirm={handleConfirmSave}
                onDismiss={() => setOpenPanel(false)} />
        );
    }

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }

    const handleSelectCategory = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any>): void => {
        let category: ICategory = {
            id: Number(option.key),
            name: option.text
        }

        setProduct({ ...product, category: category })
    }
    const handleSelectBrand = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any>): void => {
        let brand: IBrand = {
            id: Number(option.key),
            name: option.text
        }

        setProduct({ ...product, brand: brand })
    }

    function handleNew() {
        setProduct({
            name: '',
            description: '',
            category: {} as ICategory,
            brand: {} as IBrand,
            price: 0.00,
            active: 'S'
        });
        setOpenPanel(true);
    }
    function handleEdit(item: IProduct) {console.log(item)
        setProduct(item);
        setOpenPanel(true);
    }
    function handleDelete(product: IProduct) {
        setLoading(true);

        deleteProduct(Number(product.id))
            .then(result => {
                const filteredTasks = products.filter(itemFilter => itemFilter.id !== product.id);
                setProducts([...filteredTasks])
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

        if (product.id) {
            result = updateProduct(product)

        } else {
            result = createProduct(product);
        }

        result.then(result => {
            const filteredTasks = products.filter(itemFilter => itemFilter.id !== product.id);
            setProducts([...filteredTasks, result.data])
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
            });
    }
    function onChangeActive(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
        setProduct({ ...product, active: checked ? 'S' : 'N' })
    }
    return (
            <div id="product-page" className="main-content">
                <Stack horizontal={false} tokens={{ childrenGap: 0 }}>
                    <PageToolBar
                        currentPageTitle="Produtos"
                        loading={loading}
                        onNew={handleNew} />

                    <MessageBarCustom
                        messageError={messageError}
                        messageSuccess={messageSuccess}
                        onDismiss={() => handleDemissMessageBar()} />

                    <div className="data-list">
                        <ShimmeredDetailsList
                            items={products.sort((a, b) => (a.name > b.name ? 1 : -1))}
                            columns={columns}
                            setKey="set"
                            enableShimmer={loading}
                            selectionMode={SelectionMode.none} />

                        {products.length == 0 && (
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
                    headerText="Cadastro de Produto"
                    onDismiss={() => setOpenPanel(false)}
                    isFooterAtBottom={true}
                    onRenderFooterContent={onRenderFooterContent}>

                    <p>Preencha TODOS os campos obrigatórios identificados por <span className="required">*</span></p>

                    <Stack horizontal={false} styles={{
                        root: {
                            marginTop: '24px'
                        }
                    }}>
                        <Pivot>
                            <PivotItem
                                headerText="Dados Gerais">
                                <Stack horizontal={false} className="panel-form-content">

                                    <TextField label="Nome da produto"
                                        required
                                        value={product.name}
                                        onChange={event => setProduct({ ...product, name: (event.target as HTMLInputElement).value })} />

                                    <TextField label="Descrição"
                                        multiline rows={3} resizable={false}
                                        value={product.description}
                                        onChange={event => setProduct({ ...product, description: (event.target as HTMLInputElement).value })} />

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
                                            value={String(product.price)}
                                            prefix="R$ "
                                            onChange={event => setProduct({ ...product, price: Number((event.target as HTMLInputElement).value) })} />

                                        <Dropdown
                                            label="Categoria"
                                            required
                                            options={categoryOptions}
                                            styles={{
                                                dropdown: { width: 160 }
                                        }}

                                            defaultSelectedKey={product.category?.id}
                                            onChange={handleSelectCategory as any} />

                                        <Dropdown
                                            label="Marca"
                                            options={brandOptions}
                                            styles={{
                                                dropdown: { width: 160 }
                                        }}
                                            defaultSelectedKey={product.brand?.id}
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
                                        defaultChecked={product.active === 'S'}
                                        onText="Sim"
                                        offText="Não"
                                        onChange={onChangeActive} />
                                </Stack>

                            </PivotItem>
                            <PivotItem
                                headerButtonProps={{
                                    'disabled': !product.id,
                                    'style': {
                                        color: 'grey'
                                    }
                            }}
                                headerText={product.images && product.images?.length == 0 ? 'Imagens' : `Imagens (${product.images?.length})`}>

                                <div className="images-content">
                                    {!product.images && (
                                        <div className="card-image-empty">
                                            <img src={imgNoFiles} />
                                            <Text variant="large">
                                                Nenhuma foto encontrada!
                                            </Text>
                                        </div>
                                    )}
                                    <div className="card">

                                    </div>
                                    {product.images?.map(item => (
                                            <div key={item.id} className="card card-image">
                                                <img src={item.imageURL} />
                                            </div>
                                            ))}
                                </div>

                                {JSON.stringify(product.images)}
                        </PivotItem>
                    </Pivot>
                </Stack>

            </Panel>
        </div>
    )
}