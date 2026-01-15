document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. THEME TOGGLE LOGIC
       ========================================= */
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');

            // Update Icon
            themeToggleBtn.textContent = isLight ? '🌙' : '☀️';

            // Save Preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    /* =========================================
       2. BOOKING FORM LOGIC
       ========================================= */
    /* =========================================
       2. BOOKING FORM LOGIC (MODERNIZED)
       ========================================= */
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        initBookingForm();
    }

    function initBookingForm() {
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const durationInput = document.getElementById('duration');

        // UI Elements
        const durationOptions = document.querySelectorAll('.option-card');
        const timeSlots = document.querySelectorAll('.time-slot');

        // Summary Elements
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryPrice = document.getElementById('summaryPrice');

        // 1. Duration Selection
        durationOptions.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all
                durationOptions.forEach(opt => opt.classList.remove('selected'));
                // Add active to clicked
                card.classList.add('selected');
                // Update hidden input
                durationInput.value = card.getAttribute('data-value');
                // Update Summary
                updateSummary();
            });
        });

        // 2. Time Slot Selection
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                timeSlots.forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                timeInput.value = slot.getAttribute('data-time');
                updateSummary();
            });
        });

        // 3. Date Selection
        dateInput.min = new Date().toISOString().split("T")[0]; // Min today
        dateInput.addEventListener('change', updateSummary);

        // 4. Update Summary Function
        function updateSummary() {
            // Date
            const d = dateInput.value;
            summaryDate.textContent = d ? new Date(d).toLocaleDateString() : '--/--/--';

            // Time
            summaryTime.textContent = timeInput.value || '--:--';

            // Duration
            summaryDuration.textContent = durationInput.value;

            // Price Calculation (Dummy Logic)
            let basePrice = 1200; // Base rate for 1 hour
            const dur = durationInput.value;

            if (dur === '1.5 Hours') basePrice = 1800;
            if (dur === '2 Hours') basePrice = 2200; // Discounted

            summaryPrice.textContent = '₹' + basePrice;
        }

        // 5. Form Submission
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = dateInput.value;
            const time = timeInput.value;
            const duration = durationInput.value;

            if (!time || !date) {
                alert("Please select a date and time!");
                return;
            }

            // Format message
            const message = `*New Booking Request*%0A%0A` +
                `*Name:* ${name}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Date:* ${date}%0A` +
                `*Time:* ${time}%0A` +
                `*Duration:* ${duration}%0A%0A` +
                `Please confirm availablity.`;

            const ownerPhone = "919876543210";

            const whatsappUrl = `https://wa.me/${ownerPhone}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    /* =========================================
       3. CHATBOT LOGIC & INJECTION
       ========================================= */
    initChatbot();

});

function initChatbot() {
    // 1. Create Floating Action Button
    const toggler = document.createElement('button');
    toggler.className = 'chatbot-toggler';
    toggler.innerHTML = '💬'; // Default Icon
    document.body.appendChild(toggler);

    // 2. Create Chat Window
    const chatbot = document.createElement('div');
    chatbot.className = 'chatbot';
    chatbot.innerHTML = `
        <header>
            <h2>Chat with Us</h2>
            <span class="close-btn">✕</span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span>🤖</span>
                <p>Hi there! How can I help you today?</p>
            </li>
        </ul>
        <div class="chat-input">
            <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
            <span id="send-btn">➤</span>
        </div>
    `;
    document.body.appendChild(chatbot);

    // 3. Logic
    const closeBtn = chatbot.querySelector('.close-btn');
    const chatbox = chatbot.querySelector('.chatbox');
    const chatInput = chatbot.querySelector('textarea');
    const sendBtn = chatbot.querySelector('#send-btn');

    let isChatOpen = false;

    // Toggle Chat
    toggler.addEventListener('click', () => {
        document.body.classList.toggle('show-chatbot');
        isChatOpen = !isChatOpen;
        toggler.innerHTML = isChatOpen ? '✕' : '💬';
    });

    closeBtn.addEventListener('click', () => {
        document.body.classList.remove('show-chatbot');
        isChatOpen = false;
        toggler.innerHTML = '💬';
    });

    // Send Message
    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Append User Message
        chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        chatInput.value = '';

        // Simulate Bot Response
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            chatbox.appendChild(createChatLi(botResponse, 'incoming'));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }, 600);
    }

    sendBtn.addEventListener('click', handleChat);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Enter to send, Shift+Enter for new line
            e.preventDefault();
            handleChat();
        }
    });
}

function createChatLi(message, className) {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span>🤖</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerText = message;
    return chatLi;
}

function getBotResponse(input) {
    input = input.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
        return "Hello! Welcome to TurfPro. Would you like to book a slot?";
    } else if (input.includes("book") || input.includes("slot") || input.includes("price")) {
        return "You can book a slot directly via our Booking page! Prices act on hourly basis.";
    } else if (input.includes("location") || input.includes("where")) {
        return "We are located at 123 Sports Complex, City Center.";
    } else if (input.includes("contact") || input.includes("number")) {
        return "You can reach us at +91 98765 43210 or use the Contact page.";
    } else {
        return "I'm just a simple bot. Please check our About page or Contact us directly for more info!";
    }
}

/* =========================================
   4. SCROLL REVEAL & STATS ANIMATION
   ========================================= */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Check if this is the stats section to trigger counter
            if (entry.target.classList.contains('stats-section')) {
                startStatsCounter();
            }

            observer.unobserve(entry.target); // Only animate once
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

function startStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            // Lower inc to slow and higher to slow
            const inc = target / speed;

            if (count < target) {
                // Add inc to count and output in counter
                counter.innerText = Math.ceil(count + inc);
                // Call function every ms
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };

        updateCount();
    });
}
