import { getUser } from '@/utils/supabase-admin';
import { editTeam } from '@/utils/useDatabase';
import { sendEmail } from '@/utils/sendEmail';

const inviteUser = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId, teamData, formData } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const invite = await editTeam(teamId, 'invite', formData, user);

        if(invite === 'success'){
          const email = await sendEmail(`You have been invited to team ${teamData?.team_name} on SEOCopy 🤖`, formData?.invite_email, 'invite', teamData);

          if(email === 'success'){
            console.log('email success');

            return res.status(200).json({ response: 'success' });
          }
        }

        return res.status(500).json({ response: 'error' });

      } else {
        return res.status(200).json({ response: 'error' });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default inviteUser;