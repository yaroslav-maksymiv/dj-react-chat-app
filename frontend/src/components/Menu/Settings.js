export const Settings = () => {


    return (
        <div class="tab-pane fade active show" id="settings">
            <div class="settings">
                <div class="profile">
                    <img class="avatar-xl" src="dist/img/avatars/avatar-male-1.jpg" alt="avatar" />
                        <h1><a href="#">Michael Knudsen</a></h1>
                        <span>Helena, Montana</span>
                        <div class="stats">
                            <div class="item">
                                <h2>122</h2>
                                <h3>Fellas</h3>
                            </div>
                            <div class="item">
                                <h2>305</h2>
                                <h3>Chats</h3>
                            </div>
                            <div class="item">
                                <h2>1538</h2>
                                <h3>Posts</h3>
                            </div>
                        </div>
                </div>
                <div class="categories" id="accordionSettings">
                    <h1>Settings</h1>
                </div>
            </div>
        </div>
    )
}