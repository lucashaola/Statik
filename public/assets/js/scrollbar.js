class CustomScrollbar {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.content = wrapper.querySelector('.test-circles');
        this.scrollbar = wrapper.querySelector('.custom-scrollbar');
        this.thumb = wrapper.querySelector('.scrollbar-thumb');

        if (!this.content || !this.scrollbar || !this.thumb) {
            console.error('Missing required elements');
            return;
        }

        this.init();
    }

    init() {
        this.updateThumbHeight();
        this.updateThumbPosition();
        this.attachEvents();
    }

    updateThumbHeight() {
        const ratio = this.content.clientHeight / this.content.scrollHeight;
        const thumbHeight = Math.max(ratio * this.scrollbar.clientHeight * 0.6, 40);
        this.thumb.style.height = `${thumbHeight}px`;
    }

    updateThumbPosition() {
        const scrollPercent = this.content.scrollTop / (this.content.scrollHeight - this.content.clientHeight);
        const maxThumbPosition = this.scrollbar.clientHeight - this.thumb.clientHeight;
        const thumbPosition = scrollPercent * maxThumbPosition;
        this.thumb.style.transform = `translateY(${thumbPosition}px)`;
    }

    attachEvents() {
        this.content.addEventListener('scroll', () => {
            this.updateThumbPosition();
        });

        let isDragging = false;
        let startY = 0;
        let startTop = 0;

        this.thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startTop = this.content.scrollTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaY = e.clientY - startY;
            const percentDelta = deltaY / this.scrollbar.clientHeight;
            const scrollAmount = percentDelta * this.content.scrollHeight;
            
            this.content.scrollTop = startTop + scrollAmount;
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        this.scrollbar.addEventListener('click', (e) => {
            if (e.target === this.thumb) return;
            
            const clickPosition = e.clientY - this.scrollbar.getBoundingClientRect().top;
            const thumbHalf = this.thumb.clientHeight / 2;
            const percentClicked = (clickPosition - thumbHalf) / (this.scrollbar.clientHeight - this.thumb.clientHeight);
            
            this.content.scrollTop = percentClicked * (this.content.scrollHeight - this.content.clientHeight);
        });

        window.addEventListener('resize', () => {
            this.updateThumbHeight();
            this.updateThumbPosition();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.scrollbar-wrapper');
    wrappers.forEach(wrapper => new CustomScrollbar(wrapper));
});