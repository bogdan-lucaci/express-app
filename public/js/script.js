const loader = {
    show: () => {
        const _loader = document.querySelector('.loader_mask')
        _loader.classList.remove('fadeOut')
        _loader.classList.add('fadeIn')
        // _loader.style.display = 'flex'
    },
    hide: () => {
        const _loader = document.querySelector('.loader_mask')
        _loader.classList.remove('fadeIn')
        _loader.classList.add('fadeOut')
        //_loader.style.display = 'none'
    }
}