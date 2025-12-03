import { Nav, NavDropdown } from 'react-bootstrap';
import { routeWithoutLang } from '../utils/routeLocalize';

export default function LanguageChooser() {

  const languages = [
    { code: 'en', flag: 'us', name: 'English' },
    { code: 'sv', flag: 'se', name: 'Svenska' },
    { code: 'no', flag: 'no', name: 'Norsk' }
  ];

  function handleLanguageChange(lang: string) {
    // We do a hard page reload when choosing language
    // to avoid any race conditions React vs. translator
    location.replace(`/${lang}${routeWithoutLang()}`);
  }

  return <Nav>
    <NavDropdown
      title={
        <>
          <i className="language-icon bi bi-globe2"></i>
          <span>Language</span>
        </>
      }
      className="language-dropdown"
      align="end"
    >
      {languages.map((lang) => (
        <NavDropdown.Item
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
        >
          <span className={`fi fi-${lang.flag} me-2`}></span>
          {lang.name}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  </Nav>;
}