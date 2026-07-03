/**
 * KUESIONER WISUDA ELEKTRO — LOGIC & DATABASE INTEGRATION
 */

document.addEventListener('DOMContentLoaded', () => {
    // ─── STATE MANAGEMENT ───
    let currentStep = 'gateway';
    const totalSteps = 3;
    const formData = {}; 
  
    // ─── DOM ELEMENTS ───
    const form = document.getElementById('surveyForm');
    const sections = document.querySelectorAll('.step-section');
    const progressWrapper = document.getElementById('progressWrapper');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressLabel = document.getElementById('progressLabel');
    const consentCheckbox = document.getElementById('consentCheckbox');
    const btnStart = document.getElementById('btnStart');
    const consentError = document.getElementById('consentError');
    const consentWrapper = document.getElementById('consentWrapper');
  
    // ─── INITIALIZATION ───
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          btnStart.disabled = false;
          consentWrapper.classList.add('checked');
          consentWrapper.classList.remove('error');
          consentError.classList.remove('visible');
        } else {
          btnStart.disabled = true;
          consentWrapper.classList.remove('checked');
        }
      });
    }
  
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (consentCheckbox.checked) {
          goToStep(1);
        } else {
          consentWrapper.classList.add('error');
          consentError.classList.add('visible');
        }
      });
    }
  
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => removeError(input.name || input.id));
      input.addEventListener('change', () => removeError(input.name || input.id));
    });
  
    // ─── NAVIGATION & VALIDATION FUNCTIONS ───
    window.goToStep = function(step) {
      if (typeof step === 'number' && typeof currentStep === 'number' && step > currentStep) {
        if (!validateStep(currentStep)) {
          const firstError = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error, .form-error.visible');
          if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        saveStepData(currentStep);
      }
      currentStep = step;
      showSection(step);
      updateProgressBar(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    function showSection(stepId) {
      sections.forEach(section => section.classList.remove('active'));
      const targetSection = document.getElementById(`step-${stepId}`);
      if (targetSection) targetSection.classList.add('active');
    }
  
    function updateProgressBar(step) {
      if (step === 'gateway' || step === 'landing' || step === 'thankyou') {
        progressWrapper.classList.remove('active');
        return;
      }
      progressWrapper.classList.add('active');
      const percentage = Math.round(((step - 1) / totalSteps) * 100);
      
      setTimeout(() => {
        progressFill.style.width = `${percentage}%`;
        progressFill.classList.toggle('has-progress', percentage > 0);
        progressPercent.innerText = `${percentage}%`;
        progressLabel.innerText = `Halaman ${step} dari ${totalSteps}`;
      }, 50);
    }
  
    // ─── VALIDATION LOGIC ───
    function validateStep(step) {
      let isValid = true;
      if (step === 1) {
        if (!document.getElementById('inputNama').value.trim()) { showError('inputNama', 'namaError'); isValid = false; }
        
        const emailInput = document.getElementById('inputEmail');
        if (emailInput.value.trim() === '') {
            showError('inputEmail', 'emailError'); isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError('inputEmail', 'emailError'); isValid = false;
            }
        }
        
        if (!document.getElementById('inputKelas').value.trim()) { showError('inputKelas', 'kelasError'); isValid = false; }
        if (!document.getElementById('inputNim').value.trim()) { showError('inputNim', 'nimError'); isValid = false; }
      }
      if (step === 2) {
        if (!document.querySelector('input[name="lokasi"]:checked')) { showError('lokasiGroup', 'lokasiError'); isValid = false; }
        if (!document.querySelector('input[name="pakaian"]:checked')) { showError('pakaianGroup', 'pakaianError'); isValid = false; }
        if (document.querySelectorAll('input[name="hiburan"]:checked').length === 0) { showError('hiburanGroup', 'hiburanError'); isValid = false; }
      }
      if (step === 3) {
        if (!document.getElementById('inputSaran').value.trim()) { showError('inputSaran', 'saranError'); isValid = false; }
      }
      return isValid;
    }
  
    function showError(inputId, errorId) {
      if (inputId) {
        const inputEl = document.getElementById(inputId);
        if (inputEl && !inputEl.classList.contains('radio-group') && !inputEl.classList.contains('checkbox-group')) {
          inputEl.classList.add('error');
        }
      }
      if (errorId) {
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.classList.add('visible');
      }
    }
  
    function removeError(nameOrId) {
      let inputEl = document.getElementById(nameOrId);
      if (!inputEl) {
        const firstInput = document.querySelector(`input[name="${nameOrId}"]`);
        if (firstInput) inputEl = firstInput.closest('.radio-group') || firstInput.closest('.checkbox-group') || firstInput.closest('.likert-scale');
      }
      if (inputEl) inputEl.classList.remove('error');
      
      const nameToErrorMap = {
        'nama': 'namaError', 'email': 'emailError', 'kelas': 'kelasError', 'nim': 'nimError',
        'lokasi': 'lokasiError', 'pakaian': 'pakaianError', 'hiburan': 'hiburanError',
        'saran': 'saranError'
      };
      let errorId = nameToErrorMap[nameOrId] || nameOrId + 'Error';
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.classList.remove('visible');
    }
  
    // ─── DATA COLLECTION ───
    function saveStepData(step) {
      const els = form.elements;
      if (step === 1) {
        formData.nama = els['nama'].value.trim();
        formData.email = els['email'].value.trim();
        formData.kelas = els['kelas'].value.trim();
        formData.nim = els['nim'].value.trim();
      }
      if (step === 2) {
        formData.lokasi = els['lokasi'].value;
        formData.pakaian = els['pakaian'].value;
        formData.hiburan = Array.from(document.querySelectorAll('input[name="hiburan"]:checked')).map(cb => cb.value);
      }
      if (step === 3) {
        formData.saran = els['saran'].value.trim();
        formData.pesan = els['pesan'].value.trim();
      }
    }
  
    // ─── SUBMISSION & API CALL ───
    window.handleSubmit = async function() {
      if (document.getElementById('website_url').value !== '') return;
  
      if (!validateStep(3)) {
        const firstError = document.querySelector('.form-input.error, .form-error.visible');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
  
      saveStepData(3);
      const refCode = 'ELEKTRO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      formData.reference_code = refCode;
      
      const btnSubmit = document.getElementById('btnSubmit');
      btnSubmit.classList.add('btn-loading');
      Array.from(form.elements).forEach(el => el.disabled = true);
  
      // Kirim ke Vercel Serverless API
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
        // Simpan ke localStorage juga sebagai backup/export CSV
        localStorage.setItem('surveyData', JSON.stringify(formData));
        
        document.getElementById('refCode').innerText = refCode;
        progressWrapper.classList.add('active');
        progressFill.style.width = '100%';
        progressPercent.innerText = '100%';
        
        setTimeout(() => {
            goToStep('thankyou');
            btnSubmit.classList.remove('btn-loading');
        }, 800);
      } catch (error) {
        console.error('API Error (Backend not running?):', error);
        alert("Peringatan: Tidak dapat terhubung ke server. Data Anda disimpan sementara di perangkat ini.");
        localStorage.setItem('surveyData', JSON.stringify(formData));
        document.getElementById('refCode').innerText = refCode + ' (LOCAL)';
        goToStep('thankyou');
        btnSubmit.classList.remove('btn-loading');
      }
    };
  
    // ─── EXPORT TO CSV ───
    window.exportToCSV = function() {
      const savedDataStr = localStorage.getItem('surveyData');
      if (!savedDataStr) { alert('Data tidak ditemukan.'); return; }
      
      const data = JSON.parse(savedDataStr);
      const flatData = { ...data };
      if (Array.isArray(flatData.hiburan)) { flatData.hiburan = flatData.hiburan.join('; '); }
  
      const headers = Object.keys(flatData);
      const row = headers.map(header => {
        let cell = flatData[header] === undefined || flatData[header] === null ? '' : flatData[header];
        cell = cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
        return cell;
      });
  
      const csvContent = headers.join(',') + '\n' + row.join(',');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Kuesioner_Wisuda_${data.nim || 'Export'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  });
