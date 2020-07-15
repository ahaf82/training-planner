import React, { useContext, useRef, useEffect } from 'react';
import MemberContext from '../../context/member/memberContext';

const MemberFilter = () => {
    const memberContext = useContext(MemberContext);
    const text = useRef('');

    const { filterMembers, clearFilter, filtered } = memberContext;

    useEffect(() => {
        if (filtered === null) {
            text.current.value = '';
        }
    });
    
    const onChange = e => {
        if (text.current.value !== '') {
            filterMembers(e.target.value);
        } else {
            clearFilter();
        }
    }

    return (
        <form>
            <input ref={text} type="text" placeholder="Suche Mitglied..." onChange={onChange} />
        </form>
    )
}

export default MemberFilter;