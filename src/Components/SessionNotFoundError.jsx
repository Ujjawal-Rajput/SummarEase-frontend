import React from 'react'

function SessionNotFoundError({ message }) {
    return (
        <div className="empty-state">
            <div className="empty-state-content">
                <h1 style={{color:'black'}}>{message}</h1>
                <p>The session with the provided ID could not be found. Please check the session ID or try again later.</p>
            </div>
        </div>
    )
}

export default SessionNotFoundError
