document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const userId = this.getAttribute('data-id');

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/eliminar-dato/${userId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.text())
                    .then(result => {
                        Swal.fire(
                            'Eliminado!',
                            'El dato ha sido eliminado.',
                            'success'
                        );
                        // Actualiza la UI para reflejar la eliminación
                        document.getElementById(`data-row-${userId}`).remove();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar el dato.',
                            'error'
                        );
                    });
                }
            });
        });
    });
});
