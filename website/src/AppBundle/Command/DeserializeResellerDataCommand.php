<?php

namespace AppBundle\Command;

use AppBundle\Entity\Lesson;
use AppBundle\Entity\UserLessonToken;
use PlanBundle\Entity\Plan;
use StorageBundle\Entity\StorageItem;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class DeserializeResellerDataCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:deserialize-reseller-data')
            ->setDescription('Deserialize reseller\'s data from input file');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $defaultEntityManager = $container->get('doctrine.orm.default_entity_manager');
        $planManager = $container->get('plan.manager');
        $stripeManager = $container->get('stripe.manager');

        $reseller = $this->createReseller();
        $defaultEntityManager->persist($reseller);
        $output->writeln('CREATED RESELLER');
        $resellerData = \GuzzleHttp\json_decode(file_get_contents('reseller.json'), true);
        $plan = $planManager->findOnePlanBy([
            'stripePlanId' => 'EnterpriseMonth_10_5',
        ]);
        $basicPlan = $planManager->findOnePlanBy([
            'stripePlanId' => 'Basic',
        ]);
        foreach ($resellerData as $masterTeacherArray) {
            $masterTeacher = $this->createMasterTeacher($masterTeacherArray, $plan, $reseller);
            $defaultEntityManager->persist($masterTeacher);
            $output->writeln('-CREATED MASTER TEACHER '.$masterTeacher->getName());
            foreach ($masterTeacherArray['lessons'] as $lessonArray) {
                $lesson = $this->createLesson($lessonArray, $masterTeacher);
                $defaultEntityManager->persist($lesson);
                foreach ($lessonArray['userLessonTokens'] as $userLessonTokenArray) {
                    $userLessonToken = $this->createUserLessonToken($userLessonTokenArray, $masterTeacher, $lesson);
                    $defaultEntityManager->persist($userLessonToken);
                }
            }
            $output->writeln('--CREATED '.count($masterTeacherArray['lessons']).' LESSONS');
            foreach ($masterTeacherArray['storageItems'] as $storageItemArray) {
                $this->createAndSaveStorageItem($storageItemArray, $masterTeacher);
            }
            if (count($masterTeacherArray['storageItems']))
                $output->writeln('--CREATED STORAGE ITEMS');
            $stripeManager->createCustomerForUser($masterTeacher, $basicPlan);
            $output->writeln('--CREATED SUBSCRIPTION');
            foreach ($masterTeacherArray['subTeachers'] as $subTeacherArray) {
                $subTeacher = $this->createSubTeacher($subTeacherArray, $masterTeacher);
                $defaultEntityManager->persist($subTeacher);
                $output->writeln('--CREATED SUB TEACHER '.$subTeacher->getName());
                foreach ($subTeacherArray['lessons'] as $lessonArray) {
                    $lesson = $this->createLesson($lessonArray, $subTeacher);
                    $defaultEntityManager->persist($lesson);
                    foreach ($lessonArray['userLessonTokens'] as $userLessonTokenArray) {
                        $userLessonToken = $this->createUserLessonToken($userLessonTokenArray, $subTeacher, $lesson);
                        $defaultEntityManager->persist($userLessonToken);
                    }
                }
                $output->writeln('---CREATED '.count($subTeacherArray['lessons']).' LESSONS');
                foreach ($subTeacherArray['storageItems'] as $storageItemArray) {
                    $this->createAndSaveStorageItem($storageItemArray, $subTeacher);
                }
                $output->writeln('---CREATED STORAGE ITEMS');
            }
        }
        $defaultEntityManager->flush();
    }

    /**
     * @return Reseller
     */
    protected function createReseller()
    {
        $reseller = new Reseller();
        $reseller->setEnabled(true);
        $reseller->setName('Edutraining Admin');
        $reseller->setSubdomain('edu');
        $reseller->setEmail('edutraining@reseller.com');
        $reseller->setAllowSubdomains(false);
        $reseller->setMaximumUsers(100);
        $reseller->setMaximumPaidUsers(100);
        $reseller->setPlainPassword('B@14azmi');
        $reseller->setPageTitle('Tutrex');
        $reseller->setLandingHeader('Online Training Platform');
        $reseller->setLandingSubHeader('Easy to use cloud based Virtual Classroom with collaborative whiteboard and a comprehensive webinar and conferencing solution. It has everything you need for seamless online training.');
        $reseller->setLandingHeaderBottom('Virtual Classroom');
        $reseller->setLandingSubHeaderBottom('Create live lessons with social media integration to invite larger audience. Use feature packed virtual classroom to effectively deliver lessons and keep your audience engaged.');
        $reseller->setPrivacySite('www.tutrex.com');
        $reseller->setPrivacyAddressFirstLine('2255 Braeswood Park Dr');
        $reseller->setPrivacyAddressSecondLine('houston, Texas 77030');
        $reseller->setPrivacyCountry('United States');
        $reseller->setPrivacyEmail('support@tutrex.com');
        $reseller->setMailgunFromEmail('noreply@edutraining.net');
        $reseller->setMailgunUsername('postmaster@edutraining.net');
        $reseller->setMailgunPassword('ac46e64c3c08a51683c642feff7f1a25-a4502f89-16b864f4');

        return $reseller;
    }

    /**
     * @param array    $data
     * @param Plan     $plan
     * @param Reseller $reseller
     *
     * @return User
     */
    protected function createMasterTeacher(array $data, Plan $plan, Reseller $reseller)
    {
        $masterTeacher = new User();
        $this->mapCommonUserDataToEntity($data, $masterTeacher);
        $masterTeacher->setPlan($plan);
        $masterTeacher->setReseller($reseller);

        return $masterTeacher;
    }

    /**
     * @param array $data
     * @param User  $masterTeacher
     *
     * @return Teacher
     */
    protected function createSubTeacher(array $data, User $masterTeacher)
    {
        $subTeacher = new Teacher();
        $this->mapCommonUserDataToEntity($data, $subTeacher);
        $subTeacher->setBlocked($data['blocked']);
        $subTeacher->setUser($masterTeacher);
        $subTeacher->setReseller($masterTeacher->getReseller());

        return $subTeacher;
    }

    /**
     * @param array $data
     * @param User  $user
     *
     * @return User
     */
    protected function mapCommonUserDataToEntity(array $data, User $user)
    {
        $phone = $this->getContainer()->get('libphonenumber.phone_number_util')->parse($data['phone']);

        $user
            ->setUsername($data['username'])
            ->setUsernameCanonical($data['usernameCanonical'])
            ->setEmail($data['email'])
            ->setEmailCanonical($data['emailCanonical'])
            ->setEnabled($data['enabled'])
            ->setPassword($data['password'])
            ->setLastLogin($this->convertToDate($data['lastLogin']))
            ->setConfirmationToken($data['confirmationToken'])
            ->setPasswordRequestedAt($this->convertToDate($data['passwordRequestedAt']))
            ->setName($data['name'])
            ->setPhone($phone)
            ->setBanned($data['banned'])
            ->setStripeActive($data['stripeActive'])
            ->setStorageSpaceUsed($data['storageSpaceUsed'])
            ->setStorageLimit($data['storageLimit'])
            ->setStudentsInClassroom($data['studentsInClassroom'])
            ->setMinutesLessonDuration($data['minutesLessonDuration'])
            ->setRegistrationDate($this->convertToDate($data['registrationDate']))
            ->setCustomerId($data['customerId'])
            ->setSubscriptionId($data['subscriptionId'])
            ->setSubscriptionEndsAt($data['subscriptionEndsAt'])
            ->setLast4CardCode($data['last4CardCode'])
            ->setNumberOfTeachers($data['numberOfTeachers'])
            ->setClassroomLogo($data['classroomLogo'])
            ->setRoles($data['roles']);
        $user->setSalt($data['salt']);

        return $user;
    }

    /**
     * @param array $data
     * @param User  $user
     *
     * @return Lesson
     */
    protected function createLesson(array $data, User $user)
    {
        $updateLessonRecordPaths = function (array $lessonRecord) {
            return [
                'recordName' => $lessonRecord['recordName'],
                'recordPath' => $this->replaceLessonRecordPath($lessonRecord['recordPath']),
                'recordURL' => $this->replaceLessonRecordPath($lessonRecord['recordURL'])
            ];
        };
        $lessonRecords = $data['lessonRecord'] ? array_map($updateLessonRecordPaths, $data['lessonRecord']) : null;
        $lesson = new Lesson();
        $lesson
            ->setUser($user)
            ->setTitle($data['title'])
            ->setDate(date_create_from_format('Y-m-d', $data['date']))
            ->setTime($data['time'])
            ->setUTCStartDateTimeStamp($data['utcStartDateTimeStamp'])
            ->setLinkId($data['linkId'])
            ->setNumberOfInvitedUsers($data['numberOfInvitedUsers'])
            ->setStarted($data['started'])
            ->setFinished($data['finished'])
            ->setLessonRecord($lessonRecords)
            ->setIsDemoLesson($data['isDemoLesson'])
            ->setDurationHours($data['durationHours'])
            ->setDurationMinutes($data['durationMinutes'])
            ->setLessonCode($data['lessonCode']);

        return $lesson;
    }

    /**
     * @param string $token
     * @param User   $user
     * @param Lesson $lesson
     *
     * @return UserLessonToken
     */
    protected function createUserLessonToken($token, User $user, Lesson $lesson)
    {
        $userLessonToken = new UserLessonToken();
        $userLessonToken
            ->setUser($user)
            ->setLesson($lesson)
            ->setToken($token);

        return $userLessonToken;
    }

    /**
     * @param array            $data
     * @param User             $user
     * @param StorageItem|null $folder
     */
    protected function createAndSaveStorageItem(array $data, User $user, StorageItem $folder = null)
    {
        $entityManager = $this->getContainer()->get('doctrine.orm.default_entity_manager');
        $storageItem = new StorageItem();
        $filePath = $data['filePath'] ? 'edutraining/live/'.$data['filePath'] : null;
        $storageItem
            ->setUser($user)
            ->setFolder($folder)
            ->setName($data['name'])
            ->setFilePath($filePath)
            ->setType($data['type'])
            ->setCreatedAt($this->convertToDate($data['createdAt']))
            ->setUpdatedAt($this->convertToDate($data['updatedAt']))
            ->setSlug($data['slug']);
        $entityManager->persist($storageItem);
        if ($storageItem->getType() === StorageItem::TYPE_FOLDER)
            foreach ($data['files'] as $file) {
                $this->createAndSaveStorageItem($file, $user, $storageItem);
            }
    }

    /**
     * @param string $path
     *
     * @return string
     */
    protected function replaceLessonRecordPath($path)
    {
        return str_replace('/rooms/', '/rooms/edutraining/rooms/', $path);
    }

    /**
     * @param string|null $date
     *
     * @return \DateTime|null
     */
    protected function convertToDate($date)
    {
        return $date ? date_create_from_format('Y-m-d H:i:s', $date) : null;
    }
}
