import { ChatNavigation } from '../components/ChatNavigation'

export const ChatScreen = () => {
    return (
        <div class="main">
            <div class="tab-content" id="nav-tabContent">

                <div class="babble tab-pane fade active show" id="list-chat" role="tabpanel" aria-labelledby="list-chat-list">

                    <div class="chat" id="chat1">

                        <ChatNavigation />

                        <div class="content" id="content">
                            <div class="container">

                                <div class="col-md-12">

                                    <div class="message me">
                                        <div class="text-main">
                                            <div class="text-group me">
                                                <div class="text me">
                                                    <p>Roger that boss!</p>
                                                </div>
                                            </div>
                                            <div class="text-group me">
                                                <div class="text me">
                                                    <p>I have already started gathering some stuff for the mood boards, excited to start!</p>
                                                </div>
                                            </div>
                                            <span>10:21 PM</span>
                                        </div>
                                    </div>
                                    <div class="message">
                                        <img class="avatar-md" src="dist/img/avatars/avatar-female-5.jpg" data-toggle="tooltip" data-placement="top" title="Keith" alt="avatar" />
                                            <div class="text-main">
                                                <div class="text-group">
                                                    <div class="text">
                                                        <p>Great start guys, I've added some notes to the task. We may need to make some adjustments to the last couple of items - but no biggie!</p>
                                                    </div>
                                                </div>
                                                <span>11:07 PM</span>
                                            </div>
                                    </div>

                                    <div class="date">
                                        <hr />
                                        <span>Today</span>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="container">
                            <div class="col-md-12">
                                <div class="bottom">
                                    <form class="position-relative w-100">
                                        <textarea class="form-control" placeholder="Start typing for reply..." rows="1"></textarea>
                                        <button class="btn emoticons"><i class="material-icons">insert_emoticon</i></button>
                                        <button type="submit" class="btn send"><i class="material-icons">send</i></button>
                                    </form>
                                    <label>
                                        <input type="file" />
                                        <span class="btn attach d-sm-block d-none"><i class="material-icons">attach_file</i></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}