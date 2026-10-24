Preguntas

1. ¿Por qué usar un id único en lugar del nombre?

Cada personaje tiene un id que sirve para identificarlo. Lo usé porque dos personajes podrían tener el mismo nombre y eso causaría problemas al editar o eliminar alguno.

Por ejemplo, si dos personajes se llamaran Hulk, podría borrar los dos por error si los identificara por nombre. En cambio, con el id puedo elegir exactamente cuál quiero modificar.

Usé Date.now() porque es sencillo y funciona bien para este proyecto. Aunque existe otra opción llamada crypto.randomUUID(), considero que no es necesario usarla por ahora.

2. ¿Conviene guardar todos los personajes juntos o por separado en localStorage?

Decidí guardar todos los personajes juntos en una sola clave llamada personajesMarvel.

Ventajas:

Es más fácil guardar y cargar los datos.

El código es más sencillo.

Puedo trabajar con todos los personajes en un solo arreglo.

Desventajas:

Cada cambio guarda nuevamente todos los personajes.

Si los datos se dañan, podría perder toda la colección.

También podría guardar cada personaje por separado, pero eso haría el código más complicado.

Por eso elegí guardar todo junto, ya que mi proyecto tiene pocos personajes. Si tuviera miles, necesitaría otra forma de guardar la información.

3. ¿La búsqueda debe funcionar al escribir o al presionar Enter?

Decidí que la búsqueda funcione mientras el usuario escribe, para que pueda ver los resultados sin tener que presionar Enter.

Con 10 personajes funciona rápidamente. Con 1,000, la búsqueda podría tardar más, especialmente al mostrar todas las tarjetas e imágenes.

Si la aplicación creciera, podría hacer que espere un poco después de escribir o mostrar los personajes por partes. Por ahora, buscar en tiempo real funciona bien para mi proyecto.


4. ¿Qué pasa si la imagen de un personaje no funciona?

Si una imagen no existe o no carga, mi aplicación muestra una imagen genérica con el texto "Sin imagen". Así, las tarjetas mantienen el mismo tamaño y el diseño se ve ordenado.

Si el usuario deja vacío el campo de la imagen, también aparece esa imagen genérica.

Otra opción sería mostrar las iniciales del personaje, pero elegí esta solución porque es más sencilla.

La desventaja es que la imagen genérica necesita internet. Una mejora sería guardar una imagen de respaldo dentro del proyecto.

5. ¿Se deben permitir nombres vacíos o repetidos?

No permito guardar nombres vacíos ni personajes repetidos.

Uso .trim() para quitar los espacios al principio y al final del texto. Así evito que alguien registre un personaje escribiendo solamente espacios.

También evito nombres repetidos, sin importar las mayúsculas o los acentos. Por ejemplo, "Hulk" y "HULK" cuentan como el mismo nombre.

Cuando edito un personaje, la aplicación no lo compara consigo mismo, para que pueda guardar los cambios sin problemas.

Decidí hacerlo así para mantener la colección ordenada y facilitar las búsquedas.