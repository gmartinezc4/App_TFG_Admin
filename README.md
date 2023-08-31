# APLICACIÓN DE ADMINISTRACIÓN


Esta aplicación está desarrollada para el trabajo de fin de curso del grado de Ingeniería Informática de la Universidad Antonio de Nebrija.


### Pasos para desplegar la aplicación:

1. Tener instalado un editor de código, como Visual Studio Code, y un navegador web, como Google Chrome.
   
3. Clonar el repositorio en nuestro equipo.
   
   ```
    git clone https://github.com/gmartinezc4/TFG_APP_Admin.git
   ```

5. Abrir dos terminales, una para el front y otra para el back. En cada terminal nos situamos en la ruta mediante los siguientes comandos.
   
   ```
    cd front
   ```
   ```
    cd back
   ```
   
6. Iniciar la aplicación mediante la ejecución del siguiente comando en ambas terminales.
   
   ```
    npm run dev
   ```
   
7. En la terminal del front, aparecerá la ruta local en la cual se ha desplegado la interfaz de la aplicación para poder interactuar con la aplicación.
   
9. Accedemos a dicha ruta mediante nuetro navegador web.


### En caso de error

En caso de tener un error persistente que no se arregle al recargar la página el usuario deberá: 

1. Dirigirse al la clase "Contenedor", y pegar la siguiente línea de código:

   ```
    localStorage.removeItem("token");
   ```
   
2. Una vez realizado esto, se deverán guardar los cambios y seguidamente volver a borrar dicha línea y volver a guardar los cambios.
