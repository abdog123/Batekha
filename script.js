const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAsAUGxcQfcEt8pOzKzsqP8TnYOMqeHJrudAU09ZN0P2eQa0TUCgkc3F2xPtMZJVIP/exec';

function togglePass(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function cleanPhone(phone) {
    let num = phone.trim();
    while (num.startsWith('0')) { num = num.substring(1); }
    return num;
}

function toggleForms() {
    document.getElementById('loginSection').classList.toggle('hidden');
    document.getElementById('signupSection').classList.toggle('hidden');
}

function updateSpecialization() {
    const year = document.getElementById('yearSelect').value;
    const specGroup = document.getElementById('specGroup');
    const specSelect = document.getElementById('specSelect');
    specSelect.innerHTML = '';
    if (year === '1' || year === "") {
        specGroup.classList.add('hidden');
    } else {
        specGroup.classList.remove('hidden');
        if (year === '2') {
            specSelect.innerHTML = '<option value="علمي">علمي</option><option value="أدبي">أدبي</option>';
        } else if (year === '3') {
            specSelect.innerHTML = '<option value="علم علوم">علم علوم</option><option value="علم رياضة">علم رياضة</option><option value="أدبي">أدبي</option>';
        }
    }
}

// إنشاء حساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const regBtn = document.getElementById('regBtn');
    const phone = cleanPhone(document.getElementById('newPhone').value);
    regBtn.innerText = '⏳ جاري الحفظ...';
    regBtn.disabled = true;

    const url = `${SCRIPT_URL}?action=signup&name=${encodeURIComponent(document.getElementById('newName').value)}&phone=${phone}&pass=${encodeURIComponent(document.getElementById('newPass').value)}&year=${document.getElementById('yearSelect').value}&spec=${encodeURIComponent(document.getElementById('specSelect').value || "عام")}`;

    fetch(url).then(res => res.json()).then(response => {
        if (response.result === "exists") { Swal.fire('موجود', 'هذا الرقم مسجل مسبقاً', 'info'); }
        else { Swal.fire('تم', 'تم إنشاء حسابك بنجاح', 'success'); toggleForms(); }
    }).finally(() => { regBtn.innerText = 'إنشاء حساب'; regBtn.disabled = false; });
});

// تسجيل الدخول (التعديل القاتل للمشكلة)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginBtn = document.getElementById('loginBtn');
    const phoneInput = document.getElementById('logPhone').value;
    const phone = cleanPhone(phoneInput);
    const pass = document.getElementById('logPass').value;

    loginBtn.innerText = '⏳ جاري التحقق...';
    loginBtn.disabled = true;

    fetch(`${SCRIPT_URL}?action=login&phone=${phone}&pass=${encodeURIComponent(pass)}`)
    .then(res => res.json())
    .then(response => {
        if (response.result === "found") {
            // حفظ كل البيانات الممكنة عشان صفحة التحدي ماتتوهش
            const studentData = {
                name: response.name,
                phone: response.phone, // السطر ده هو الحياة
                phoneNum: response.phone, // زيادة تأكيد
                year: response.year,
                spec: response.spec
            };
            
            localStorage.setItem('activeStudent', JSON.stringify(studentData));
            localStorage.setItem('userPhone', response.phone); // نسخة احتياطية ثالثة

            Swal.fire({
                icon: 'success',
                title: 'تم تسجيل الدخول!',
                text: `أهلاً يا ${response.name}`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'dash_boared.html'; 
            });

        } else if (response.result === "wrong_pass") {
            Swal.fire('خطأ', 'كلمة المرور غير صحيحة', 'error');
        } else {
            Swal.fire('غير موجود', 'الرقم غير مسجل', 'warning');
        }
    })
    .finally(() => { 
        loginBtn.innerText = 'دخول'; 
        loginBtn.disabled = false; 
    });
});
