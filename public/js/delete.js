document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

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
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/eliminar-dato`, {
                        method: 'DELETE',
                        headers: { 'x-csrf-token': csrfToken }
                    })
                    .then(response => response.text())
                    .then(result => {
                        Swal.fire(
                            'Eliminado!',
                            'El dato ha sido eliminado.',
                            'success'
                        );
                        // Recargar la página para reflejar la eliminación
                        setTimeout(() => { window.location.reload(); }, 1200);
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
