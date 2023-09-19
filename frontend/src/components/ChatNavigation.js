export const ChatNavigation = () => {
    return (
        <div class="top">
            <div class="container">
                <div class="col-md-12">
                    <div class="inside">
                        <a href="#"><img class="avatar-md" src="dist/img/avatars/avatar-female-5.jpg" data-toggle="tooltip" data-placement="top" title="Keith" alt="avatar" /></a>
                        <div class="status">
                            <i class="material-icons online">fiber_manual_record</i>
                        </div>
                        <div class="data">
                            <h5><a href="#">Keith Morris</a></h5>
                            <span>Active now</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons md-30">more_vert</i></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <button class="dropdown-item"><i class="material-icons">clear</i>Clear History</button>
                                <button class="dropdown-item"><i class="material-icons">block</i>Block Contact</button>
                                <button class="dropdown-item"><i class="material-icons">delete</i>Delete Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}