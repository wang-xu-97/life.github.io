document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
      // 为每个代码块创建换行状态存储
      const preElement = wrapper.querySelector('pre.chroma');
      if (preElement) {
          // 默认从 localStorage 读取用户偏好
          const wrapEnabled = localStorage.getItem('codeWrapEnabled') === 'true';
          if (wrapEnabled) {
              preElement.classList.add('wrap-lines');
              const wrapButton = wrapper.querySelector('.wrap-button');
              if (wrapButton) {
                  wrapButton.classList.add('active');
                  const span = wrapButton.querySelector('span');
                  if (span) span.textContent = '不换行';
              }
          }
      }
  });

  // 换行按钮功能
  document.addEventListener('click', function(e) {
      if (e.target.closest('.wrap-button')) {
          const button = e.target.closest('.wrap-button');
          const codeBlock = button.closest('.code-block-wrapper');
          const preElement = codeBlock.querySelector('pre.chroma');
          
          if (preElement) {
              preElement.classList.toggle('wrap-lines');
              button.classList.toggle('active');
              
              // 保存用户偏好
              const isNowWrapped = preElement.classList.contains('wrap-lines');
              localStorage.setItem('codeWrapEnabled', isNowWrapped.toString());
              
              // 更新按钮文本
              const span = button.querySelector('span');
              if (span) {
                  span.textContent = isNowWrapped ? '不换行' : '换行';
              }
          }
      }
  });
    document.querySelectorAll('.copy-button').forEach(button => {
      // 确保只创建一个提示元素
      if (!button.querySelector('.copy-tooltip')) {
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = '✓ 已复制';
        button.appendChild(tooltip);
      }
      button.addEventListener('click', () => {
        const wrapper = button.closest('.code-block-wrapper');
        const codeBlock = wrapper.querySelector('pre code');
        const codeLines = codeBlock.querySelectorAll('span.cl');
        const codeText = Array.from(codeLines).map(line => {
            const lineClone = line.cloneNode(true);
            const lineNumber = lineClone.querySelector('span.ln');
            if (lineNumber) {
              lineNumber.remove();
            }
            return lineClone.textContent;
          })
          .join('');

        const tooltip = button.querySelector('.copy-tooltip');
        
        // 临时保存按钮原始内容
        const originalHTML = button.innerHTML;
        
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        document.body.appendChild(textarea);
        textarea.select();
        button.classList.add('hide-original');
        navigator.clipboard.writeText(textarea.value).then(() => {
        tooltip.style.opacity = '1';
        // 2秒后恢复按钮原始状态
        setTimeout(() => {
            tooltip.style.opacity = '0';
            button.classList.remove('hide-original');
        }, 2000);
        });
        
        document.body.removeChild(textarea);
      });
    });

    document.querySelectorAll('.language-label').forEach(button => {
      button.addEventListener('click', () => {
        const codeBlock = button.closest('.code-block-wrapper');
        const chroma = codeBlock?.querySelector('pre.chroma');
        if (chroma) {
          chroma.classList.toggle('collapsed');
        }
        else console.error('chroma折叠失败');
      });
    });
});
