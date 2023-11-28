
(function(){
  const form = document.querySelector('.myform');
    const pond = FilePond.create(document.querySelector('.filepondImage'), {
        labelIdle: 'Glissez et déposez vos fichiers ou parcourez',
        acceptedFileTypes: ['image/jpeg', 'image/png'],
        allowFileTypeValidation: true,
        allowFileRemove: true,
        maxFiles: 10,
        maxFileSize: '5MB',
        fileEncodeName : 'images'
      });

      // Événement ajout de fichier
      pond.on('addfile', (error, file) => {
        // Vérifiez si le type de fichier est autorisé
        if (!isFileTypeAllowed(file.file)) {
          // Supprimez le fichier si le type n'est pas autorisé
          pond.removeFile(file.id);
          alert('Type de fichier non autorisé. Veuillez télécharger uniquement des images JPEG ou PNG.');
        }else
        {
          const imagesInput = document.querySelector('.filepondImage');
          const currentImages = JSON.parse(imagesInput.value);
          currentImages.push(file.file.name);
          imagesInput.value = JSON.stringify(currentImages);
        }
      });
    
      // Fonction pour vérifier le type de fichier
      function isFileTypeAllowed(file) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        return allowedTypes.includes(file.type);
      }
    
})()

  