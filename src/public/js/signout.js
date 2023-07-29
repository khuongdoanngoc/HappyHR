// sign out config
const signOutLink = document.getElementById('signoutLink')
if (signOutLink) {
    signOutLink.addEventListener('click', async function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>.
        try {
            const response = await fetch('/auth/signOut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                window.location.href = '/auth/page-signin';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error(error);
        }
    });
}
