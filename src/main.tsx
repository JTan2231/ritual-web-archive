export function Main() {
    return (
        <div id="container" style={{ cursor: 'text', border: '1px solid #0a0a0a', position: 'fixed', width: '70vw', height: '40vh', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} onClick={() => {
            document.getElementById("chatbox")!.focus();
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div id="conversation" style={{ flexGrow: 1, backgroundColor: '#efefef' }}>Testing</div>
                <input id="chatbox" type="text" style={{ border: 0, outline: 0, width: '100%', padding: 0, alignSelf: 'flex-end' }} placeholder="What have you been up to?" />
            </div>
        </div>
    );
}
