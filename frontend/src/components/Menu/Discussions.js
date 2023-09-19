export const Discussions = ({ }) => {

    
    return (
        <div class="tab-pane fade active show" id="members">
            <div class="search">
                <form class="form-inline position-relative">
                    <input type="search" class="form-control" id="people" placeholder="Search for people..." />
                    <button type="button" class="btn btn-link loop"><i class="material-icons">search</i></button>
                </form>
                <button class="btn create" data-toggle="modal" data-target="#exampleModalCenter"><i class="material-icons">person_add</i></button>
            </div>
            <div class="list-group sort">
                <button class="btn filterMembersBtn active show" data-toggle="list" data-filter="all">All</button>
                <button class="btn filterMembersBtn" data-toggle="list" data-filter="online">Online</button>
                <button class="btn filterMembersBtn" data-toggle="list" data-filter="offline">Offline</button>
            </div>
            <div class="contacts">
                <h1>Contacts</h1>
                <div class="list-group" id="contacts" role="tablist">
                    <a href="#" class="filterMembers all online contact" data-toggle="list">
                        <img class="avatar-md" src="dist/img/avatars/avatar-female-3.jpg" data-toggle="tooltip" data-placement="top" title="Harmony" alt="avatar" />
                        <div class="status">
                            <i class="material-icons online">fiber_manual_record</i>
                        </div>
                        <div class="data">
                            <h5>Harmony Otero</h5>
                            <p>Indore, India</p>
                        </div>
                        <div class="person-add">
                            <i class="material-icons">person</i>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}