import React, { useState, useEffect } from 'react';
import Layout from '../../../layout/Layout';
import axios from 'axios';
import { Users, Mail, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MEMBER_DASHBOARD, SEND_BULK_EMAIL } from '../../../api';

const MemberDashboard = () => {
  const [members, setMembers] = useState([]);
  const [sentMail, setSentMail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${MEMBER_DASHBOARD}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMembers(response.data.individualCompanies || []);
      setSentMail(response.data.memberEmail || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members data');
    } finally {
      setLoading(false);
    }
  };

  const sendMembershipEmail = async (year) => {
    const membersForYear = members.filter(member => member.last_payment_vailidity === year);

  
  const membersWithoutEmail = membersForYear.filter(
    member => !member.indicomp_email || member.indicomp_email.trim() === ""
  );

  if (membersWithoutEmail.length > 0) {
    toast.error("Some members do not have an email. Please add their emails first.");
    return;
  }
    setSendingEmail(true);
    try {
    
      const emailData = membersForYear.map(member => ({
        indicomp_id: member.id,
        member_vailidity: member.last_payment_vailidity
      }));

      const response = await axios.post(
        `${SEND_BULK_EMAIL}`,
        { member_email_data: emailData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Emails sent successfully for ${year} members`);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails');
    } finally {
      setSendingEmail(false);
    }
  };


const handleYearCardClick = (year) => {
    const membersForYear = members.filter(member => member.last_payment_vailidity === year);
   
    const serializedMembers = encodeURIComponent(btoa(JSON.stringify(membersForYear)));
  
    navigate(`/member-list?year=${year}&members=${serializedMembers}`);
  };

  
  const membersByYear = members.reduce((acc, member) => {
    const year = member.last_payment_vailidity;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(member);
    return acc;
  }, {});


  const years = Object.keys(membersByYear).sort((a, b) => b - a);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-56">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full mx-auto ">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Member Dashboard</h2>
              <p className="text-sm text-gray-600">Manage and view member information</p>
            </div>
          </div>
        </div>

        {/* Total Members Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
          onClick={() => {
            const serializedMembers = encodeURIComponent(btoa(JSON.stringify(members)));
            navigate(`/member-list?year=all&members=${serializedMembers}`);
          }}
          className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Members</p>
                  <h3 className="text-2xl font-bold text-gray-900">{members.length}</h3>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Validity by Year */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Calendar className="text-green-600 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Membership Validity by Year</h2>
            </div>
            
            {years.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {years.map(year => {
                  const mailInfo = sentMail.find(item => item.member_vailidity === year);
                  return (
                    <div 
                    key={year} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleYearCardClick(year)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Year {year}</h3>
                      
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {membersByYear[year].length} members
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                    {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendMembershipEmail(year);
                        }}
                        disabled={sendingEmail}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4" />
                        {sendingEmail ? 'Sending...' : 'Send Mail'}
                      </button> */}

{mailInfo ? (
         <div className=" flex flex-row gap-1 text-xs">
        
         <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
             <span className={` ${mailInfo.sent == membersByYear[year].length ? " ":"animate-ping"} absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`}></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
           </span>
           <span className="text-gray-700">Sent: {mailInfo.sent}</span>
         </div>
       
       {mailInfo.notsent !== 0  && (
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
           </span>
           <span className="text-gray-700">Not Sent: {mailInfo.notsent}</span>
         </div>
       )}
         
       </div>
       
        ) : (
          // else → show send mail button
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendMembershipEmail(year);
            }}
            disabled={sendingEmail}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            {sendingEmail ? 'Sending...' : 'Send Mail'}
          </button>
        )}
                   
                     
                      <div className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                        View details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                  )

                }
                 
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No membership data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberDashboard;