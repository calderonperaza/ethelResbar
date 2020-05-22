new Vue({
    el: "#appRESBAR",
    data: {
        categorias: [],
        categoria: {
            id: "0",
            nombre: ""
        },
        productos: [],
        nombreold: "",
        cat: {
            nombre: ""
        },
        displayOption: "",
        agg: true,
        searchDisplay: "",
        urlApi: `${ApiRestUrl}/categorias`
    },
    methods: {

        /*
        Modifica el registro seleccionado
        */



        edithRegistro() {
            // Tambien actualiza la tabla producto CASCADA
            // obtengo el nombre anterior
            axios.get(this.urlApi + "/" + this.categoria.id).then(
                response => {
                    this.nombreold = response.data.nombre
                }
            ).catch(ex => { console.log(ex) })

            //Actualizando la categoria
            axios.patch(`${this.urlApi}/${this.categoria.id}`, {
                nombre: this.categoria.nombre
            }).then(
                response => {
                    this.edithProductosCascada(this.nombreold, this.categoria.nombre);
                    console.log(this.cat);
                    this.getAll();
                    console.log(response.status);
                }
            ).catch(ex => { console.log(ex) })

        },
        //modifica los productos en CASCADA
        edithProductosCascada(viejo, nuevo) {
            //obteniendo los productos a actualizar categoria
            var filtro = { "where": { "categoria.nombre": `${viejo}` } };
            axios.get(ApiRestUrl + "/productos?filter=" + JSON.stringify(filtro)).then(
                response => {
                    this.productos = response.data
                    for (elemento in this.productos) {
                        this.productos[elemento].categoria.nombre = nuevo;
                        axios.patch(ApiRestUrl + "/productos/" + this.productos[elemento].id,
                            JSON.stringify(this.productos[elemento]), { headers: { 'content-type': 'application/json', } });
                    }

                }
            ).catch(ex => { console.log(ex) })
        },


        /*
        creacion de nuevos registros
        (no se pueden crear registros vacios)
         */
        createRegistro: function() {
            if (this.categoria.nombre.trim() !== "") {
                this.agg = true;
                axios.post(`${this.urlApi}`, {
                    nombre: `${this.categoria.nombre}`
                }).then(response => {
                    console.log(response.status);
                    this.categorias = response.data;
                    this.getAll();
                }).catch(ex => {
                    console.log(ex)
                });
            } else {
                this.agg = false;
            }

        },

        /*
        eliman registros, correspondiente al id seleccionado
         */
        removeRegistro: function() {
            this.displayOption = 'eliminar';
            axios.delete(`${this.urlApi}/${this.categoria.id}`).then(
                response => {
                    this.getAll();
                    console.log(response.status)
                }
            ).catch(ex => { console.log(ex) });

        },

        /*
        recolecta todos los datos al hacer una peticion al api
         */
        getAll() {
            axios.get(this.urlApi).then(
                response => {
                    this.categorias = response.data
                }
            ).catch(ex => { console.log(ex) })
        },

        /*
        limpiando valores de la categoria previamente seleccionada
         */
        clearData() {
            this.categoria = {
                id: "0",
                nombre: ""
            }
            this.getAll();
        },
        addMode() {
            this.clearData();
            this.displayOption = "Agregue una nueva Categoria";
        },
        getCategoriaSelected(cat) {
            this.displayOption = "Modifique la Categoria";
            this.categoria = cat;
        },
        filtro(valor) {
            if (this.searchDisplay === "") return true;
            let array = (this.categorias[valor].id + this.categorias[valor].nombre).toUpperCase();
            return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
        }
    },
    /*
    hook para inicializar los valores de la tabla
     */
    mounted() {
        this.getAll();
    },
});
//funcion para quitar los espacios en blanco
function AvoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}