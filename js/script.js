// 全局变量
let currentSection = 0;
const totalSections = 4;
const container = document.getElementById('container');
const dots = document.querySelectorAll('.scroll-dot');
const headerContainer = document.getElementById('headerContainer'); // 获取 header 容器
let isScrolling = false;

// 页面滚动功能
function updateSection(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= totalSections) return;
    
    const previousSection = currentSection;
    currentSection = sectionIndex;
    
    // 添加动画状态类
    const sections = document.querySelectorAll('.section');
    
    // 移除所有动画状态类
    sections.forEach(section => {
        section.classList.remove('active', 'entering', 'leaving');
    });
    
    // 为当前section添加entering类
    if (sections[currentSection]) {
        sections[currentSection].classList.add('entering');
    }
    
    // 为之前的section添加leaving类
    if (sections[previousSection] && previousSection !== currentSection) {
        sections[previousSection].classList.add('leaving');
    }
    
    // 执行transform动画
    let translateY;
    if (currentSection === totalSections - 1) {
        // 最后一层切换到上面1/4的位置，显示25vh高度的内容
        translateY = -currentSection * 100 + 75; // -225vh，让25vh的第四层显示在上面1/4位置
    } else {
        translateY = -currentSection * 100;
    }
    container.style.transform = `translateY(${translateY}vh)`;
    
    // 延迟添加active类，创建更流畅的动画效果
    setTimeout(() => {
        sections.forEach((section, index) => {
            section.classList.remove('entering', 'leaving');
            if (index === currentSection) {
                section.classList.add('active');
            }
        });
    }, 100);
    
    // 更新指示器
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSection);
    });

    // 根据当前 section 更新 header 状态
    if (currentSection > 0) {
        headerContainer.classList.add('scrolled');
    } else {
        headerContainer.classList.remove('scrolled');
    }
}

function handleWheel(event) {
    if (isScrolling) return;
    
    isScrolling = true;
    
    if (event.deltaY > 0) {
        // 向下滚动
        if (currentSection < totalSections - 1) {
            updateSection(currentSection + 1);
        }
    } else {
        // 向上滚动
        if (currentSection > 0) {
            updateSection(currentSection - 1);
        }
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// 鼠标滚轮事件
const newsContainer = document.querySelector('.news-container ul');

window.addEventListener('wheel', function(event) {
    // 检查鼠标是否在新闻容器内
    if (newsContainer && newsContainer.contains(event.target)) {
        // 如果鼠标在新闻容器内，并且新闻容器可以滚动，则不阻止页面滚动
        if (newsContainer.scrollHeight > newsContainer.clientHeight) {
            // 允许新闻容器内部的滚动
            return;
        }
    }
    handleWheel(event);
}, { passive: false });

// 点击指示器切换
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (!isScrolling) {
            updateSection(index);
        }
    });
});

// 键盘导航
window.addEventListener('keydown', (event) => {
    if (isScrolling) return;
    
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        if (currentSection < totalSections - 1) {
            updateSection(currentSection + 1);
        }
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        if (currentSection > 0) {
            updateSection(currentSection - 1);
        }
    } else if (event.key === 'Home') {
        event.preventDefault();
        updateSection(0);
    } else if (event.key === 'End') {
        event.preventDefault();
        updateSection(totalSections - 1);
    }
});

// 触摸设备支持
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (event) => {
    touchStartY = event.changedTouches[0].screenY;
});

window.addEventListener('touchend', (event) => {
    if (isScrolling) return;
    
    touchEndY = event.changedTouches[0].screenY;
    const touchDiff = touchStartY - touchEndY;
    
    if (Math.abs(touchDiff) > 50) {
        isScrolling = true;
        
        if (touchDiff > 0) {
            // 向上滑动，显示下一层
            if (currentSection < totalSections - 1) {
                updateSection(currentSection + 1);
            }
        } else {
            // 向下滑动，显示上一层
            if (currentSection > 0) {
                updateSection(currentSection - 1);
            }
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
});

// 轮播图功能
let currentSlide = 0;
const totalSlides = 5;
const carouselImages = document.querySelectorAll('.carousel-image');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');
let carouselInterval;

function updateCarousel(slideIndex) {
    // 更新图片显示
    carouselImages.forEach((img, index) => {
        img.classList.toggle('active', index === slideIndex);
    });
    
    // 更新指示器
    carouselIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // 更新文字显示
    const carouselTexts = document.querySelectorAll('.carousel-text');
    carouselTexts.forEach((text, index) => {
        text.classList.toggle('active', index === slideIndex);
    });
    
    currentSlide = slideIndex;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    updateCarousel(nextIndex);
}

function startCarousel() {
    // 先清除之前的定时器，避免重复启动
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 3000); // 每3秒切换一次
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// 点击指示器切换图片
carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        updateCarousel(index);
        stopCarousel();
        // 立即重新开始自动轮播，保持正常速度
        startCarousel();
    });
});

// 鼠标悬停时停止自动轮播
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', () => {
        // 立即重新开始自动轮播
        startCarousel();
    });
}

// 科研动态轮播图功能 - 重新设计的稳定版本
class ResearchCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 8;
        this.items = document.querySelectorAll('.research-item');
        this.dots = document.querySelectorAll('.research-dot');
        this.container = document.querySelector('.research-carousel');
        this.interval = null;
        this.isUserInteracting = false;
        this.autoPlayDelay = 3000; // 3秒自动切换
        this.userInteractionDelay = 500; // 用户操作后0.5秒重新开始
        
        this.init();
    }
    
    init() {
        if (this.items.length === 0) return;
        
        // 绑定事件
        this.bindEvents();
        
        // 开始自动轮播
        this.start();
    }
    
    updateSlide(index) {
        // 确保索引在有效范围内
        this.currentSlide = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
        
        // 更新轮播项显示
        this.items.forEach((item, i) => {
            item.classList.toggle('active', i === this.currentSlide);
        });
        
        // 更新指示器
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }
    
    next() {
        this.updateSlide(this.currentSlide + 1);
    }
    
    previous() {
        this.updateSlide(this.currentSlide - 1);
    }
    
    goToSlide(index) {
        this.updateSlide(index);
    }
    
    start() {
        this.stop(); // 先停止之前的定时器
        this.interval = setInterval(() => {
            if (!this.isUserInteracting) {
                this.next();
            }
        }, this.autoPlayDelay);
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    handleUserInteraction(callback) {
        this.isUserInteracting = true;
        this.stop();
        
        if (callback) callback();
        
        // 延迟重新开始自动轮播
        setTimeout(() => {
            this.isUserInteracting = false;
            this.start();
        }, this.userInteractionDelay);
    }
    
    bindEvents() {
        // 绑定指示器点击事件
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.handleUserInteraction(() => {
                    this.goToSlide(index);
                });
            });
        });
        
        // 绑定鼠标悬停事件
        if (this.container) {
            this.container.addEventListener('mouseenter', () => {
                this.isUserInteracting = true;
                this.stop();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.isUserInteracting = false;
                // 稍微延迟重新开始，避免快速进出的问题
                setTimeout(() => {
                    if (!this.isUserInteracting) {
                        this.start();
                    }
                }, 500);
            });
        }
    }
}

// 创建科研轮播图实例
let researchCarouselInstance = null;

// 全局函数供HTML调用
function nextResearchSlideManual() {
    if (researchCarouselInstance) {
        researchCarouselInstance.handleUserInteraction(() => {
            researchCarouselInstance.next();
        });
    }
}

function previousResearchSlide() {
    if (researchCarouselInstance) {
        researchCarouselInstance.handleUserInteraction(() => {
            researchCarouselInstance.previous();
        });
    }
}

// 页面DOM加载完成后立即开始轮播
document.addEventListener('DOMContentLoaded', () => {
    // 初始化第一个section为active状态
    const sections = document.querySelectorAll('.section');
    if (sections[0]) {
        sections[0].classList.add('active');
    }
    
    // 开始主轮播图
    startCarousel();
    
    // 初始化科研轮播图
    researchCarouselInstance = new ResearchCarousel();
});

// 备用启动逻辑，确保轮播一定会开始
setTimeout(() => {
    if (!carouselInterval) {
        startCarousel();
    }
    if (!researchCarouselInstance) {
        researchCarouselInstance = new ResearchCarousel();
    }
}, 1000); // 1秒后检查并启动