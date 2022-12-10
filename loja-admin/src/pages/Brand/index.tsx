import { ColumnActionsMode, IColumn, Panel, PanelType, SelectionMode, ShimmeredDetailsList, Stack, TextField } from "@fluentui/react";
import { IBrand } from "@typesCustom";
import { useCallback, useEffect, useState } from "react";
import { DetailsListOptions } from "../../components/DetailsListOptions";
import { MessageBarCustom } from "../../components/MessageBarCustom";
import { PageToolBar } from "../../components/PageToolBar";
import { PanelFooterContent } from "../../components/PanelFooterContent";
import { createBrand, deleteBrand, listBrands, updateBrand } from "../../services/server";


export function BrandPage() {

    //States - Entidades
    const [brand, setBrand] = useState<IBrand>({} as IBrand);
    const [brands, setBrands] = useState<IBrand[]>([]);

    //State - Mensagens
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    //State - Carregando
    const [loading, setLoading] = useState(true);

    //State - Abre e fecha form
    const [openPanel, setOpenPanel] = useState(false);

    //Colunas
    const columns: IColumn[] = [
        {
            key: 'name',
            name: 'Nome da Marca',
            fieldName: 'name',
            minWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled
        }, {
            key: 'option',
            name: 'Opções',
            minWidth: 60,
            maxWidth: 60,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            onRender: (item: IBrand) => (
                <DetailsListOptions
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)} />
            )
        }
    ]

    //Renderizar barra de botões no panel
    const onRenderFooterContent = (): JSX.Element => (
        <PanelFooterContent
            id={brand.id as number}
            loading={loading}
            onConfirm={handleConfirmSave}
            onDismiss={()=> setOpenPanel(false)} />
    );

    useEffect(() => {

        listBrands()
            .then(result => {
                setBrands(result.data)
            })
            .catch(error => {
                setMessageError(error.message);
                setInterval(() => {
                    handleDemissMessageBar();
                }, 10000);
            })
            .finally(() => setLoading(false))

    }, [])

    function handleDemissMessageBar() {
        setMessageError('');
        setMessageSuccess('');
    }

    function handleNew() {
        setBrand({
            name: ''
        });

        setOpenPanel(true);
    }
    function handleEdit(data: IBrand) {
        setBrand( data );
        setOpenPanel(true);
    }
    function handleDelete(data: IBrand) {
        deleteBrand(Number(data.id))
            .then(() => {
                const filtered = brands.filter(item => (item.id !== data.id));
            
                setBrands([...filtered]);

                setMessageSuccess('Registro excluído com sucesso!');

                setTimeout(() => {
                    setMessageSuccess('');
                }, 5000);
            })
            .catch(error => {
                setMessageError((error as Error).message);
                setTimeout(() => {
                    handleDemissMessageBar();
                }, 10000);
            });
    }
    async function handleConfirmSave() {

        let result = null;

        try {

            if (brand.id) {
                result = await updateBrand(brand);
            } else {
                result = await createBrand(brand);
            }

            const filtered = brands.filter(item => (item.id !== brand.id));

            setBrands([...filtered, result.data])

            setMessageSuccess('Registro salvo com sucesso!')

            setTimeout(() => {
                setMessageSuccess('');
            }, 5000);

        } catch (error) {

            setMessageError((error as Error).message);
            setTimeout(() => {
                handleDemissMessageBar();
            }, 10000);

        } finally{
                setOpenPanel(false);
        }

    }
    

    return (
        <div id="brand-page" className="main-content">
            <Stack horizontal={false}>
                <PageToolBar
                    currentPageTitle="Marcas"
                    loading={loading}
                    onNew={handleNew} />

                <MessageBarCustom
                    messageError={messageError}
                    messageSuccess={messageSuccess}
                    onDismiss={handleDemissMessageBar} />


                <div className="data-list">
                    <ShimmeredDetailsList
                        items={brands.sort((a,b) => a.name > b.name ? 1 : -1)}
                        columns={columns}
                        setKey="set"
                        enableShimmer={loading}
                        selectionMode={SelectionMode.none} />
                </div>
            </Stack>

            <Panel
                className="panel-form"
                isOpen={openPanel}
                type={PanelType.medium}
                headerText="Cadastro de Marca"
                isFooterAtBottom={true}
                onDismiss={() => setOpenPanel(false)}
                onRenderFooterContent={onRenderFooterContent}>

                <p>Preencha TODOS os campos obrigatórios identificados por <span className="required">*</span></p>

                <Stack horizontal={false} className="panel-form-content">
                    <TextField
                        label="Nome da Marca"
                        required
                        value={brand.name}
                        onChange={event => setBrand({ ...brand, name: (event.target as HTMLInputElement).value })} />

                </Stack>
            </Panel>
        </div>
    )
}