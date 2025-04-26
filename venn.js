function generarSets(filtrosActuales){ //lista
    let subcatStatus = false;
    let trio = ["genero", "subgenero", "director"];
    //RELLENO LA LISTA CON LA INFO
    let categoriasSel = [filtrosActuales.genero];
    let list_dicts_Categ = []

    if(filtrosActuales.subgenero){
        let conjA = filtrosActuales.subgenero;
        categoriasSel.push(filtrosActuales.subgenero);
        subcatStatus = true;
    }else{
        trio.splice(1,1);
    }

    if(filtrosActuales.director){
        let conjB = filtrosActuales.director;
        categoriasSel.push(filtrosActuales.director);
    }else{
        if(subcatStatus){ //si se seleccionó subgenero
            trio.splice(2,1);
        }else{
            trio.splice(1,1);
        }
    }

    console.log("EL TRÍO ESSSSS: ", trio) //poner las verificaciones por consola despues de todos los ifs, obvio


    for(let i=0;i<categoriasSel.length;i++){
        categPelis_objs = peliculas.filter((peli)=>{
            console.log("A PUNTO DE COMPARAR",peli[trio[i]]);
            return peli[trio[i]]==categoriasSel[i];
        })
        //console.log("CategPelis: ",categPelis.map((peliObj)=>{return peliObj.titulo}));
        categPelis = categPelis_objs.map((peliObj)=>{return peliObj.titulo}); //para extraer los titulos
        list_dicts_Categ.push({label: categoriasSel[i], values: categPelis});
    }

    console.log("LA LISTA CURADA ES: ",list_dicts_Categ);
    return list_dicts_Categ;

}




//movieSets = lists_dicts_Categ
function generarVenn(lists_dicts_Categ){

    const movieSets = lists_dicts_Categ;
    d3.select("#venn-diagram").selectAll("*").remove();

/*     function cardinalSeccion(pelisSelect){

        let cardinales = [];

        // Función para obtener la diferencia entre dos conjuntos
        function difference(setA, setB) {
        return setA.filter(item => !setB.includes(item));
        }

        // Función para obtener la intersección entre dos conjuntos
        function intersection(setA, setB) {
        return setA.filter(item => setB.includes(item));
        }

        // Función para obtener la unión de tres conjuntos
        function union(setA, setB) {
        return [...new Set([...setA, ...setB])];
        }


        if(pelisSelect.length==1){
            const A = pelisSelect[0].values; // Acción
            cardinales.push(A);
        }else if(pelisSelect.length==2){
            const A = pelisSelect[0].values; // Acción
            const B = pelisSelect[1].values; // Keanu Reeves

            cardinales.push((difference(A, B)));
            cardinales.push((difference(B, A)));
            cardinales.push((intersection(A, B)));
        }else if(pelisSelect.length==3){
            // Asignación de conjuntos A, B y C
            const A = pelisSelect[0].values; // Acción
            const B = pelisSelect[1].values; // Keanu Reeves
            const C = pelisSelect[2].values; // Hnas Wachowski

            // Cálculo de las secciones solicitadas
            cardinales.push(difference(A, union(B, C))); // A - (B ∪ C)
            cardinales.push(difference(B, union(A, C))); // B - (A ∪ C)
            cardinales.push(difference(C, union(A, B))); // C - (A ∪ B)
            cardinales.push(difference(intersection(A, B), C)); // (A ∩ B) - C
            cardinales.push(difference(intersection(A, C), B)); // (A ∩ C) - B
            cardinales.push(difference(intersection(B, C), A)); // (B ∩ C) - A
            cardinales.push(intersection(A, intersection(B, C))); // A ∩ B ∩ C
        
            // Resultados
            console.log("CARDINALES: ",cardinales);
        }

        return cardinales;

    }

    cardinalSeccion(movieSets);

    function prepareVennData(sets) {
        const result = [];
        const numSets = sets.length;

        for (let i = 0; i < numSets; i++) {
          const items = sets[i].values;
          result.push({
            sets: [sets[i].label],
            size: items.length, //MODIFICAR POR SEGURIDAD
            items
          });
        }
    
        for (let i = 0; i < numSets; i++) {
          for (let j = i + 1; j < numSets; j++) {
            const s1 = sets[i];
            const s2 = sets[j];
            const intersection = s1.values.filter(x => s2.values.includes(x));
            if (intersection.length > 0) {
              result.push({
                sets: [s1.label, s2.label],
                size: 2, //MODIFICAR POR SEGURIDAD
                items: intersection
              });
            }
          }
        }
    
        if (numSets >= 3) {
          const [A, B, C] = sets;
          const intersection = A.values.filter(
            x => B.values.includes(x) && C.values.includes(x)
          );
          if (intersection.length > 0) {
            result.push({
              sets: [A.label, B.label, C.label],
              size: 1, //MODIFICAR POR SEGURIDAD
              items: intersection
            });
          }
        }

        lista_cardinales = cardinalSeccion(sets);


        console.log("RESULTADOS previo a AGREGAR+: ", result, lista_cardinales);

        for(let i=0;i<result.length;i++){
            Object.assign(result[i], { items: lista_cardinales[i], cardinal: lista_cardinales[i].length});
        }

        console.log("RESULTADOS: ", result);
        return result;
    }   
 */
    const colors = {
      'Acción': '#FF5733',
      'Keanu Reeves': '#33A8FF',
      'Hnas Wachowski': '#33FF57'
    };

    function formatVenn(pelisSelect){

        let VennData = [];
        let cardinales = [];

        // Función para obtener la diferencia entre dos conjuntos
        function difference(setA, setB) {
        return setA.filter(item => !setB.includes(item));
        }

        // Función para obtener la intersección entre dos conjuntos
        function intersection(setA, setB) {
        return setA.filter(item => setB.includes(item));
        }

        // Función para obtener la unión de 2 conjuntos
        function union(setA, setB) {
        return [...new Set([...setA, ...setB])];
        }


        if(pelisSelect.length==1){
            const A = pelisSelect[0].values; // Acción
            VennData.push({
                sets: [pelisSelect[0].label],
                size: A.length, //MODIFICAR POR SEGURIDAD
                items: A,
                cardinal: A.length
            })
            cardinales.push(A);
        }else if(pelisSelect.length==2){
            const A = pelisSelect[0].values; // Acción
            const B = pelisSelect[1].values; // Keanu Reeves

            cardinales.push((difference(A, B)));
            cardinales.push((difference(B, A)));
            cardinales.push((intersection(A, B)));

            VennData.push({
                sets: [pelisSelect[0].label],
                size: 5, //MODIFICAR POR SEGURIDAD
                items: cardinales[0],
                cardinal: cardinales[0].length
            },{
                sets: [pelisSelect[1].label],
                size: 5, //MODIFICAR POR SEGURIDAD
                items: cardinales[1],
                cardinal: cardinales[1].length
            },{
                sets: [pelisSelect[0].label, pelisSelect[1].label],
                size: 2, //MODIFICAR POR SEGURIDAD
                items: cardinales[2],
                cardinal: cardinales[2].length
            });

        }else if(pelisSelect.length==3){
            // Asignación de conjuntos A, B y C
            const A = pelisSelect[0].values; // Acción
            const B = pelisSelect[1].values; // Keanu Reeves
            const C = pelisSelect[2].values; // Hnas Wachowski
        
            // Cálculo de las secciones solicitadas
            cardinales.push(difference(A, union(B, C))); // A - (B ∪ C)
            cardinales.push(difference(B, union(A, C))); // B - (A ∪ C)
            cardinales.push(difference(C, union(A, B))); // C - (A ∪ B)
            cardinales.push(difference(intersection(A, B), C)); // (A ∩ B) - C
            cardinales.push(difference(intersection(A, C), B)); // (A ∩ C) - B
            cardinales.push(difference(intersection(B, C), A)); // (B ∩ C) - A
            cardinales.push(intersection(A, intersection(B, C))); // A ∩ B ∩ C
        
            VennData.push({
                sets: [pelisSelect[0].label], //A
                size: 5,
                items: cardinales[0],
                cardinal: cardinales[0].length
            },{
                sets: [pelisSelect[1].label], //B
                size: 5, //MODIFICAR POR SEGURIDAD
                items: cardinales[1],
                cardinal: cardinales[1].length
            },{
                sets: [pelisSelect[2].label], //C
                size: 5, //MODIFICAR POR SEGURIDAD
                items: cardinales[2],
                cardinal: cardinales[2].length
            },{
                sets: [pelisSelect[0].label, pelisSelect[1].label], //AB
                size: 2, //MODIFICAR POR SEGURIDAD
                items: cardinales[3],
                cardinal: cardinales[3].length
            },{
                sets: [pelisSelect[0].label, pelisSelect[2].label], //AC
                size: 2, //MODIFICAR POR SEGURIDAD
                items: cardinales[4],
                cardinal: cardinales[4].length
            },{
                sets: [pelisSelect[1].label, pelisSelect[2].label], //BC
                size: 2, //MODIFICAR POR SEGURIDAD
                items: cardinales[5],
                cardinal: cardinales[5].length
            },{
                sets: [pelisSelect[0].label, pelisSelect[1].label, pelisSelect[2].label],
                size: 1, //MODIFICAR POR SEGURIDAD
                items: cardinales[6],
                cardinal: cardinales[6].length
            });



            
        }

        // Resultados
        console.log("CARDINALES: ",cardinales);
        console.log("VENNDATA: ",VennData);

        return VennData;

    }

    const vennData = formatVenn(movieSets);

    const chart = venn.VennDiagram()
      .width(500)
      .height(500);

    const div = d3.select("#venn-diagram")
      .datum(vennData)
      .call(chart);

    // Colorear los círculos
    div.selectAll(".venn-circle path")
      .style("fill", "lightblue")
      .style("fill-opacity", 0.6).style("border-color", "black");

    // Eliminar etiquetas de conjuntos dentro del gráfico
    //div.selectAll(".venn-circle text").text(d => d.cardinal);



    // Mostrar los números (cantidades) en las regiones
    div.selectAll(".venn-area text")
      .text(d => d.cardinal)
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#000");

    // Tooltip
    const tooltip = d3.select("#tooltip");

    div.selectAll(".venn-area")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 1).style("font-size", "36px");

        const items = d.items || [];
        const text = items.length > 0 ? items.join(", <br>") : "Ninguna película";
        const label = d.sets.join(" ∩ ");

        tooltip.html(`<strong>${label}</strong><br>${text}`)
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.4);

        tooltip.style("opacity", 0);
      });
}