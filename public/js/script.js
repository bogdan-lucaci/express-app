const loader = {
    show: () => {
        const _loader = document.querySelector('.loader_mask')
        _loader.classList.remove('fadeOut')
        _loader.style.display = 'flex'
    },
    hide: () => {
        const _loader = document.querySelector('.loader_mask')
        _loader.classList.add('fadeOut')
        //_loader.style.display = 'none'
    }
}

const onDocumentReady = (() => {
    loader.hide()
})()