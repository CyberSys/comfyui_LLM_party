import { app } from "../../scripts/app.js";

class LLMPartyExtension {
    constructor() {
        this.container = null;
        this.apiButton = null;
        this.aboutButton = null;
        this.fastApiButton = null;
        this.apiModal = null;
        this.aboutModal = null;

        this.createContainer();
        this.createAPIModal();
        this.createAboutModal();

        this.makeDraggable(this.container);
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 60px;
            left: 20px;
            height: 30px;
            background-color: #1e1e1e;
            border: 1px solid #444;
            border-radius: 5px;
            display: flex;
            align-items: center;
            z-index: 1000;
        `;

        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            width: 20px;
            height: 100%;
            background-color: #2c2c2c;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        dragHandle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
            </svg>
        `;

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = `
            display: flex;
            height: 100%;
        `;

        this.apiButton = this.createButton('API', `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
        `, () => this.showAPIModal());

        this.fastApiButton = this.createButton('FastAPI', `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        `, () => this.sendFastApiRequest());

        this.aboutButton = this.createButton('About', `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
        `, () => this.showAboutModal());

        buttonWrapper.appendChild(this.apiButton);
        buttonWrapper.appendChild(this.fastApiButton);
        buttonWrapper.appendChild(this.aboutButton);

        this.container.appendChild(dragHandle);
        this.container.appendChild(buttonWrapper);
        document.body.appendChild(this.container);
    }

    createButton(title, svgContent, onClick) {
        const button = document.createElement('button');
        button.innerHTML = svgContent;
        button.title = title;
        button.style.cssText = `
            width: 30px;
            height: 100%;
            background-color: #2c2c2c;
            color: white;
            border: none;
            border-right: 1px solid #444;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        button.onclick = onClick;
        return button;
    }

    createAPIModal() {
        this.apiModal = document.createElement('div');
        this.apiModal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #2c2c2c;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 300px;
            border-radius: 5px;
        `;

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        `;
        closeBtn.onclick = () => this.hideAPIModal();

        const title = document.createElement('h2');
        title.textContent = 'Set API Key';
        title.style.color = 'white';

        const form = document.createElement('form');
        form.onsubmit = (e) => this.submitApiKey(e);

        const baseUrlLabel = document.createElement('label');
        baseUrlLabel.textContent = 'Base URL:';
        baseUrlLabel.style.color = 'white';
        const baseUrlInput = document.createElement('input');
        baseUrlInput.type = 'text';
        baseUrlInput.id = 'baseUrl';
        baseUrlInput.value = 'https://api.openai.com/v1/';
        baseUrlInput.style.cssText = `
            width: 100%;
            padding: 5px;
            margin: 5px 0;
            box-sizing: border-box;
            background-color: #3c3c3c;
            color: white;
            border: 1px solid #555;
        `;

        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'API Key:';
        apiKeyLabel.style.color = 'white';
        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.id = 'apiKey';
        apiKeyInput.style.cssText = `
            width: 100%;
            padding: 5px;
            margin: 5px 0;
            box-sizing: border-box;
            background-color: #3c3c3c;
            color: white;
            border: 1px solid #555;
        `;

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Set API Key';
        submitButton.style.cssText = `
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        `;

        form.appendChild(baseUrlLabel);
        form.appendChild(baseUrlInput);
        form.appendChild(apiKeyLabel);
        form.appendChild(apiKeyInput);
        form.appendChild(submitButton);

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(form);

        this.apiModal.appendChild(modalContent);
        document.body.appendChild(this.apiModal);
    }

    createAboutModal() {
        this.aboutModal = document.createElement('div');
        this.aboutModal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #2c2c2c;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 60%;
            max-width: 600px;
            border-radius: 5px;
            color: white;
        `;

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        `;
        closeBtn.onclick = () => this.hideAboutModal();

        const title = document.createElement('h2');
        title.textContent = 'ComfyUI LLM Party';

        const content = document.createElement('div');
        content.innerHTML = `
            <p>github: <a href="https://github.com/heshengtao/comfyui_LLM_party" target="_blank" style="color: #4CAF50;">heshengtao/comfyui_LLM_party</a></p>
            <p>bilibili: <a href="https://space.bilibili.com/26978344?spm_id_from=333.1007.0.0" target="_blank" style="color: #4CAF50;">@party host BB machine</a></p>
            <p>youtube: <a href="https://www.youtube.com/@comfyui-LLM-party" target="_blank" style="color: #4CAF50;">@comfyui-LLM-party</a></p>
            <p>QQ: <a href="https://github.com/heshengtao/comfyui_LLM_party/blob/main/img/Q%E7%BE%A4.jpg" target="_blank" style="color: #4CAF50;">931057213</a></p>
            <p>openart: <a href="https://openart.ai/workflows/profile/comfyui_llm_party?sort=latest&tab=creation" target="_blank" style="color: #4CAF50;">@comfyui-LLM-party</a></p>
            <p>feishu: <a href="https://dcnsxxvm4zeq.feishu.cn/wiki/IyUowXNj9iH0vzk68cpcLnZXnYf?fromScene=spaceOverview" target="_blank" style="color: #4CAF50;">@comfyui-LLM-party</a></p>
        `;

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(content);

        this.aboutModal.appendChild(modalContent);
        document.body.appendChild(this.aboutModal);
    }

    showAPIModal() {
        this.apiModal.style.display = 'block';
    }

    hideAPIModal() {
        this.apiModal.style.display = 'none';
    }

    showAboutModal() {
        this.aboutModal.style.display = 'block';
    }

    hideAboutModal() {
        this.aboutModal.style.display = 'none';
    }

    async submitApiKey(e) {
        e.preventDefault();
        const baseUrl = document.getElementById('baseUrl').value;
        const apiKey = document.getElementById('apiKey').value;
        const endpoint = '/party/update_config';  // New endpoint for updating config
    
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    openai_api_key: apiKey,
                    base_url: baseUrl
                })
            });
    
            if (response.ok) {
                const result = await response.json();
                alert('API Key and Base URL updated successfully!');
                this.hideAPIModal();
            } else {
                const errorMessage = await response.text();
                console.error('Server responded with an error:', response.status, errorMessage);
                alert(`Failed to update API Key and Base URL: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert(`An error occurred: ${error.message}`);
        }
    }

    async sendFastApiRequest() {
        const endpoint = '/party/fastapi';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                const result = await response.json();
                console.log('FastAPI请求成功:', result);
                alert('FastAPI请求已发送并成功处理！');
            } else {
                const errorMessage = await response.text();
                console.error('FastAPI请求失败:', response.status, errorMessage);
                alert(`FastAPI请求失败: ${errorMessage}`);
            }
        } catch (error) {
            console.error('FastAPI请求错误:', error);
            alert(`发生错误: ${error.message}`);
        }
    }

    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = element.querySelector('div');
        dragHandle.onmousedown = dragMouseDown;
    
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

// Register the extension
app.registerExtension({
    name: "comfy.LLMPartyExtension",
    setup() {
        new LLMPartyExtension();
    },
});