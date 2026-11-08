(function() {
    // 1. Lấy thông tin cấu hình từ đoạn mã nhúng
    const currentScript = document.currentScript || (function() {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src.includes('orbit-widget.js')) return scripts[i];
        }
        return null;
    })();

    if (!currentScript) {
        console.warn('[Orbit Widget] Không tìm thấy script nhúng.');
        return;
    }

    const botId = currentScript.getAttribute('data-bot-id');
    let apiBase = currentScript.getAttribute('data-api-base');
    const scriptUrl = new URL(currentScript.src, window.location.href);

    if (!botId) {
        console.warn('[Orbit Widget] Thiếu thuộc tính data-bot-id.');
        return;
    }

    // Tự suy diễn apiBase nếu không được truyền
    if (!apiBase) {
        apiBase = scriptUrl.origin + '/api';
    } else {
        try {
            apiBase = new URL(apiBase, scriptUrl.origin).toString().replace(/\/$/, '');
        } catch (error) {
            console.warn('[Orbit Widget] data-api-base khong hop le, dung API mac dinh.');
            apiBase = scriptUrl.origin + '/api';
        }
    }

    if (!/^https?:\/\//.test(apiBase)) {
        console.warn('[Orbit Widget] API base khong hop le.');
        return;
    }

    // 2. CSS Styles - Isolated
    const styleId = 'orbit-widget-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .orbit-widget-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                box-sizing: border-box;
            }
            .orbit-widget-container * {
                box-sizing: border-box;
            }
            .orbit-widget-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00f0ff, #7701d0);
                box-shadow: 0 4px 15px rgba(0, 240, 255, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.3s ease;
                border: none;
                color: white;
                outline: none;
            }
            .orbit-widget-btn:hover {
                transform: scale(1.05);
            }
            .orbit-widget-btn svg {
                width: 28px;
                height: 28px;
                fill: currentColor;
            }
            .orbit-widget-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 360px;
                height: 520px;
                max-height: calc(100vh - 120px);
                background-color: #ffffff;
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                border: 1px solid #eaeaea;
            }
            .orbit-widget-panel.orbit-widget-open {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0);
            }
            .orbit-widget-header {
                background: linear-gradient(135deg, #00f0ff, #7701d0);
                color: white;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
                font-size: 16px;
            }
            .orbit-widget-close {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 24px;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
            }
            .orbit-widget-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background-color: #f9fafb;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .orbit-widget-message {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.5;
                word-wrap: break-word;
            }
            .orbit-widget-msg-ai {
                width: 100%;
                max-width: 100%;
                padding: 0;
                background: transparent;
                border: 0;
                color: #111827;
                align-self: flex-start;
                display: flex;
                align-items: flex-start;
                gap: 9px;
            }
            .orbit-widget-ai-avatar {
                width: 28px;
                height: 28px;
                flex: 0 0 28px;
                margin-top: 2px;
                border-radius: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #111827;
                color: #ffffff;
                font-size: 10px;
                font-weight: 800;
                line-height: 1;
            }
            .orbit-widget-ai-content {
                min-width: 0;
                flex: 1;
                padding: 11px 12px;
                border: 1px solid #e2e8f0;
                border-radius: 4px 12px 12px 12px;
                background: #ffffff;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
            }
            .orbit-widget-ai-content h2,
            .orbit-widget-ai-content h3,
            .orbit-widget-ai-content h4 {
                margin: 4px 0 8px;
                color: #0f172a;
                font-weight: 700;
                line-height: 1.3;
            }
            .orbit-widget-ai-content h2 {
                font-size: 15px;
            }
            .orbit-widget-ai-content h3,
            .orbit-widget-ai-content h4 {
                font-size: 14px;
            }
            .orbit-widget-ai-content p {
                margin: 0 0 9px;
                line-height: 1.55;
            }
            .orbit-widget-ai-content p:last-child,
            .orbit-widget-ai-content ul:last-child,
            .orbit-widget-ai-content ol:last-child,
            .orbit-widget-ai-content pre:last-child,
            .orbit-widget-ai-content .orbit-widget-data-list:last-child {
                margin-bottom: 0;
            }
            .orbit-widget-ai-content ul,
            .orbit-widget-ai-content ol {
                margin: 0 0 8px;
                padding-left: 20px;
            }
            .orbit-widget-ai-content li {
                margin: 4px 0;
            }
            .orbit-widget-ai-content strong {
                font-weight: 700;
                color: #0f172a;
            }
            .orbit-widget-ai-content code {
                padding: 2px 5px;
                border-radius: 5px;
                background: #eef2ff;
                color: #312e81;
                font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
                font-size: 12px;
            }
            .orbit-widget-ai-content pre {
                margin: 8px 0;
                padding: 10px;
                overflow-x: auto;
                border-radius: 8px;
                background: #0f172a;
                color: #e5e7eb;
            }
            .orbit-widget-ai-content pre code {
                padding: 0;
                background: transparent;
                color: inherit;
            }
            .orbit-widget-ai-content hr {
                border: 0;
                border-top: 1px solid #e5e7eb;
                margin: 10px 0;
            }
            .orbit-widget-citation {
                display: inline-flex;
                align-items: center;
                min-height: 19px;
                padding: 1px 6px;
                border-radius: 10px;
                background: #ecfeff;
                border: 1px solid #a5f3fc;
                color: #0e7490;
                font-size: 10px;
                font-weight: 700;
                vertical-align: 1px;
                white-space: nowrap;
            }
            .orbit-widget-data-list {
                margin: 9px 0;
                overflow: hidden;
                border: 1px solid #dbe4ee;
                border-radius: 8px;
                background: #f8fafc;
            }
            .orbit-widget-data-record + .orbit-widget-data-record {
                border-top: 3px solid #ffffff;
            }
            .orbit-widget-data-field {
                display: grid;
                grid-template-columns: minmax(88px, 42%) minmax(0, 1fr);
                gap: 9px;
                padding: 7px 9px;
                align-items: start;
            }
            .orbit-widget-data-field + .orbit-widget-data-field {
                border-top: 1px solid #e2e8f0;
            }
            .orbit-widget-data-label {
                color: #64748b;
                font-size: 11px;
                font-weight: 600;
                line-height: 1.35;
            }
            .orbit-widget-data-value {
                min-width: 0;
                color: #0f172a;
                font-size: 12px;
                font-weight: 650;
                line-height: 1.4;
                overflow-wrap: anywhere;
            }
            .orbit-widget-msg-user {
                background-color: #00f0ff;
                color: #000000;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .orbit-widget-msg-error {
                background-color: #fef2f2;
                border: 1px solid #fca5a5;
                color: #991b1b;
                align-self: center;
                text-align: center;
                font-size: 13px;
                max-width: 90%;
            }
            .orbit-widget-footer {
                padding: 12px 16px;
                background-color: #ffffff;
                border-top: 1px solid #eaeaea;
                display: flex;
                gap: 8px;
            }
            .orbit-widget-input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            .orbit-widget-input:focus {
                border-color: #00f0ff;
            }
            .orbit-widget-input:disabled {
                background-color: #f3f4f6;
                cursor: not-allowed;
            }
            .orbit-widget-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #111827;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            .orbit-widget-send:hover:not(:disabled) {
                background-color: #374151;
            }
            .orbit-widget-send:disabled {
                background-color: #9ca3af;
                cursor: not-allowed;
            }
            .orbit-widget-send svg {
                width: 18px;
                height: 18px;
                fill: currentColor;
            }
            .orbit-widget-typing {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 12px 16px;
                background-color: #ffffff;
                border: 1px solid #eaeaea;
                border-radius: 12px;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            .orbit-widget-dot {
                width: 6px;
                height: 6px;
                background-color: #9ca3af;
                border-radius: 50%;
                animation: orbit-widget-bounce 1.4s infinite ease-in-out both;
            }
            .orbit-widget-dot:nth-child(1) { animation-delay: -0.32s; }
            .orbit-widget-dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes orbit-widget-bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            @media (max-width: 480px) {
                .orbit-widget-panel {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    max-height: 100%;
                    border-radius: 0;
                    transform: translateY(100%);
                }
                .orbit-widget-panel.orbit-widget-open {
                    transform: translateY(0);
                }
                .orbit-widget-btn {
                    bottom: 16px;
                    right: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 3. UI Construction
    const container = document.createElement('div');
    container.className = 'orbit-widget-container';

    // FAB Button
    const btn = document.createElement('button');
    btn.className = 'orbit-widget-btn';
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>`;
    
    // Panel
    const panel = document.createElement('div');
    panel.className = 'orbit-widget-panel';

    // Header
    const header = document.createElement('div');
    header.className = 'orbit-widget-header';
    header.innerHTML = `
        <div>Orbit AI Assistant</div>
        <button class="orbit-widget-close">&times;</button>
    `;

    // Body
    const body = document.createElement('div');
    body.className = 'orbit-widget-body';

    // Footer (Input)
    const footer = document.createElement('div');
    footer.className = 'orbit-widget-footer';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'orbit-widget-input';
    input.placeholder = 'Hỏi tôi bất cứ điều gì...';
    
    const sendBtn = document.createElement('button');
    sendBtn.className = 'orbit-widget-send';
    sendBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

    footer.appendChild(input);
    footer.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);

    container.appendChild(panel);
    container.appendChild(btn);
    document.body.appendChild(container);

    // 4. Logic & State
    let isOpen = false;
    let isWaiting = false;
    const sessionKey = `orbit_widget_session_${botId}`;
    let sessionId = localStorage.getItem(sessionKey);

    const togglePanel = () => {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.add('orbit-widget-open');
            input.focus();
            if (body.children.length === 0) {
                appendMessage('ai', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?');
            }
            scrollToBottom();
        } else {
            panel.classList.remove('orbit-widget-open');
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            body.scrollTop = body.scrollHeight;
        }, 50);
    };

    const cleanMessageText = (text) => {
        return String(text || '')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    const escapeHtml = (text) => {
        return cleanMessageText(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const formatInlineMarkdown = (line) => {
        return line
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(S\d+)\]/g, '<span class="orbit-widget-citation">$1</span>');
    };

    const parseTableCells = (line) => {
        return line
            .replace(/^\s*\|/, '')
            .replace(/\|\s*$/, '')
            .split('|')
            .map((cell) => cell.trim());
    };

    const isTableLine = (line) => /^\s*\|.*\|\s*$/.test(line);
    const isTableSeparator = (line) => {
        if (!isTableLine(line)) return false;
        const cells = parseTableCells(line);
        return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
    };

    const renderCompactTable = (headerLines, dataLines) => {
        let headers = headerLines.flatMap(parseTableCells).filter(Boolean);
        const rows = dataLines.map(parseTableCells).filter((row) => row.some(Boolean));
        const columnCount = Math.max(headers.length, ...rows.map((row) => row.length), 0);

        if (!columnCount) return '';
        if (headers.length > columnCount) headers = headers.slice(0, columnCount);
        while (headers.length < columnCount) headers.push(`Thông tin ${headers.length + 1}`);

        const records = (rows.length ? rows : [headers]).map((row) => {
            const fields = Array.from({ length: columnCount }, (_, index) => {
                const value = (row[index] || '').replace(/^[-*]\s+/, '').trim();
                if (!value) return '';
                return `<div class="orbit-widget-data-field">`
                    + `<div class="orbit-widget-data-label">${formatInlineMarkdown(headers[index])}</div>`
                    + `<div class="orbit-widget-data-value">${formatInlineMarkdown(value)}</div>`
                    + `</div>`;
            }).join('');
            return fields ? `<div class="orbit-widget-data-record">${fields}</div>` : '';
        }).join('');

        return records ? `<div class="orbit-widget-data-list">${records}</div>` : '';
    };

    const renderMarkdown = (text) => {
        const escaped = escapeHtml(text);
        if (!escaped) return '';

        const blocks = [];
        const codeBlocks = [];
        const withoutCodeBlocks = escaped.replace(/```([\s\S]*?)```/g, (match, code) => {
            const key = `@@ORBIT_CODE_BLOCK_${codeBlocks.length}@@`;
            codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
            return key;
        });

        let listType = null;
        const closeList = () => {
            if (listType) {
                blocks.push(`</${listType}>`);
                listType = null;
            }
        };

        const lines = withoutCodeBlocks.split('\n');
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const rawLine = lines[lineIndex];
            const line = rawLine.trim();

            if (!line) {
                closeList();
                continue;
            }

            const codeIndex = line.match(/^@@ORBIT_CODE_BLOCK_(\d+)@@$/);
            if (codeIndex) {
                closeList();
                blocks.push(codeBlocks[Number(codeIndex[1])] || '');
                continue;
            }

            if (isTableLine(line)) {
                const tableLines = [];
                let cursor = lineIndex;
                while (cursor < lines.length && isTableLine(lines[cursor].trim())) {
                    tableLines.push(lines[cursor].trim());
                    cursor++;
                }

                const separatorIndex = tableLines.findIndex(isTableSeparator);
                if (separatorIndex > 0) {
                    closeList();
                    blocks.push(renderCompactTable(
                        tableLines.slice(0, separatorIndex),
                        tableLines.slice(separatorIndex + 1)
                    ));
                    lineIndex = cursor - 1;
                    continue;
                }
            }

            if (/^---+$/.test(line)) {
                closeList();
                blocks.push('<hr>');
                continue;
            }

            const heading = line.match(/^(#{1,4})\s+(.+)$/);
            if (heading) {
                closeList();
                const level = Math.min(heading[1].length + 1, 4);
                blocks.push(`<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`);
                continue;
            }

            const orderedItem = line.match(/^\d+\.\s+(.+)$/);
            if (orderedItem) {
                if (listType !== 'ol') {
                    closeList();
                    listType = 'ol';
                    blocks.push('<ol>');
                }
                blocks.push(`<li>${formatInlineMarkdown(orderedItem[1])}</li>`);
                continue;
            }

            const unorderedItem = line.match(/^[-*]\s+(.+)$/);
            if (unorderedItem) {
                if (listType !== 'ul') {
                    closeList();
                    listType = 'ul';
                    blocks.push('<ul>');
                }
                blocks.push(`<li>${formatInlineMarkdown(unorderedItem[1])}</li>`);
                continue;
            }

            closeList();
            blocks.push(`<p>${formatInlineMarkdown(line)}</p>`);
        }

        closeList();
        return blocks.join('');
    };

    const appendMessage = (role, text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `orbit-widget-message orbit-widget-msg-${role}`;
        if (role === 'ai') {
            const avatar = document.createElement('div');
            avatar.className = 'orbit-widget-ai-avatar';
            avatar.textContent = 'AI';

            const content = document.createElement('div');
            content.className = 'orbit-widget-ai-content';
            content.innerHTML = renderMarkdown(text);

            msgDiv.appendChild(avatar);
            msgDiv.appendChild(content);
        } else {
            msgDiv.textContent = cleanMessageText(text);
        }
        body.appendChild(msgDiv);
        scrollToBottom();
    };

    const appendTyping = () => {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'orbit-widget-typing-indicator';
        typingDiv.className = 'orbit-widget-typing';
        typingDiv.innerHTML = `
            <div class="orbit-widget-dot"></div>
            <div class="orbit-widget-dot"></div>
            <div class="orbit-widget-dot"></div>
        `;
        body.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTyping = () => {
        const indicator = document.getElementById('orbit-widget-typing-indicator');
        if (indicator) indicator.remove();
    };

    const setInputState = (disabled) => {
        input.disabled = disabled;
        sendBtn.disabled = disabled;
        isWaiting = disabled;
        if (!disabled) input.focus();
    };

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text || isWaiting) return;

        input.value = '';
        appendMessage('user', text);
        setInputState(true);
        appendTyping();

        try {
            const response = await fetch(`${apiBase}/public/widget/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    bot_id: botId,
                    message: text,
                    session_id: sessionId
                })
            });

            const result = await response.json();

            removeTyping();

            if (!response.ok) {
                const errorMsg = result.message || 'Đã có lỗi xảy ra.';
                appendMessage('error', errorMsg);
            } else {
                if (result.session_id && result.session_id !== sessionId) {
                    sessionId = result.session_id;
                    localStorage.setItem(sessionKey, sessionId);
                }
                if (result.answer) {
                    appendMessage('ai', result.answer);
                }
            }
        } catch (error) {
            removeTyping();
            appendMessage('error', 'Không thể kết nối đến máy chủ AI.');
        } finally {
            setInputState(false);
        }
    };

    // 5. Events Binding
    btn.addEventListener('click', togglePanel);
    header.querySelector('.orbit-widget-close').addEventListener('click', togglePanel);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})();
