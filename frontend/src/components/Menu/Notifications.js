export const Notifications = () => {

    
    return (
        <div id="notifications" class="tab-pane fade active show">
            <div class="search">
                <form class="form-inline position-relative">
                    <input type="search" class="form-control" id="notice" placeholder="Filter notifications..." />
                    <button type="button" class="btn btn-link loop"><i class="material-icons filter-list">filter_list</i></button>
                </form>
            </div>
            <div class="list-group sort">
                <button class="btn filterNotificationsBtn active show" data-toggle="list" data-filter="all">All</button>
                <button class="btn filterNotificationsBtn" data-toggle="list" data-filter="latest">Latest</button>
                <button class="btn filterNotificationsBtn" data-toggle="list" data-filter="oldest">Oldest</button>
            </div>
            <div class="notifications">
                <h1>Notifications</h1>
                <div class="list-group" id="alerts" role="tablist">
                    <a href="#" class="filterNotifications all latest notification" data-toggle="list">
                        <img class="avatar-md" src="dist/img/avatars/avatar-female-1.jpg" data-toggle="tooltip" data-placement="top" title="Janette" alt="avatar" />
                        <div class="status">
                            <i class="material-icons online">fiber_manual_record</i>
                        </div>
                        <div class="data">
                            <p>Janette has accepted your friend request on Swipe.</p>
                            <span>Oct 17, 2018</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}