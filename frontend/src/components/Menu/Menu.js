import { useState } from 'react'

import { Navigation } from './Navigation'
import { Discussions } from './Discussions'
import { Notifications } from './Notifications'
import { Settings } from './Settings'

export const Menu = () => {
    const [activeTab, setActiveTab] = useState('Discussions')
    
    return (
        <>
            <Navigation setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="sidebar" id="sidebar">
                <div className="container">
                    <div className="col-md-12">
                        <div className="tab-content">
                            {activeTab === 'Discussions' && <Discussions />}
                            {activeTab === 'Notifications' && <Notifications />}
                            {activeTab === 'Settings' && <Settings />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}