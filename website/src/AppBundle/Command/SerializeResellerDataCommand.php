<?php

namespace AppBundle\Command;

use AppBundle\Entity\Lesson;
use AppBundle\Entity\UserLessonToken;
use StorageBundle\Entity\StorageItem;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class SerializeResellerDataCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:serialize-reseller-data')
            ->setDescription('Serialize reseller\'s data from reseller entity manager');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $resellerEntityManager = $container->get('doctrine.orm.reseller_entity_manager');
        $masterTeachers = $resellerEntityManager->getRepository('UserBundle:User')->getMasterTeachers();
        $masterTeachersArray = array_map(function (User $masterTeacher) {
            $result = $this->convertUserToArray($masterTeacher);
            $result['roles'] = ['ROLE_TEACHER', 'ROLE_ALLOWED_TO_SWITCH'];
            $result['subTeachers'] = array_map(function (Teacher $teacher) {
                $result = $this->convertUserToArray($teacher);
                $result['roles'] = ['ROLE_SUB_TEACHER'];
                $result['blocked'] = $teacher->getBlocked();

                return $result;
            }, $masterTeacher->getTeachers()->getValues());

            return $result;
        }, $masterTeachers);
        $file = fopen('reseller.json', 'w');
        fwrite($file, \GuzzleHttp\json_encode($masterTeachersArray));
        fclose($file);
    }

    /**
     * @param User $user
     *
     * @return array
     */
    protected function convertUserToArray(User $user)
    {
        $phone = $user->getPhone() ? "+{$user->getPhone()->getCountryCode()}{$user->getPhone()->getNationalNumber()}" : null;
        $lessons = array_map(function (Lesson $lesson) {
            return $this->convertLessonToArray($lesson);
        }, $user->getLessons()->getValues());
        $storageItemsToConvert = $user->getStorageItems()->filter(function (StorageItem $storageItem) {
            return !$storageItem->getFolder();
        })->getValues();
        $storageItems = array_map(function (StorageItem $storageItem) {
            return $this->convertStorageItemToArray($storageItem);
        }, $storageItemsToConvert);

        return [
            'username' => $user->getUsername(),
            'usernameCanonical' => $user->getUsernameCanonical(),
            'email' => $user->getEmail(),
            'emailCanonical' => $user->getEmailCanonical(),
            'enabled' => $user->isEnabled(),
            'salt' => $user->getSalt(),
            'password' => $user->getPassword(),
            'lastLogin' => $this->formatDate($user->getLastLogin()),
            'confirmationToken' => $user->getConfirmationToken(),
            'passwordRequestedAt' => $this->formatDate($user->getPasswordRequestedAt()),
            'name' => $user->getName(),
            'phone' => $phone,
            'banned' => $user->getBanned(),
            'stripeActive' => $user->getStripeActive(),
            'storageSpaceUsed' => $user->getStorageSpaceUsed(),
            'storageLimit' => $user->getStorageLimitInGb(),
            'studentsInClassroom' => $user->getStudentsInClassroom(),
            'minutesLessonDuration' => $user->getMinutesLessonDuration(),
            'registrationDate' => $this->formatDate($user->getRegistrationDate()),
            'customerId' => $user->getCustomerId(),
            'subscriptionId' => $user->getSubscriptionId(),
            'subscriptionEndsAt' => $user->getSubscriptionEndsAt(),
            'last4CardCode' => $user->getLast4CardCode(),
            'numberOfTeachers' => $user->getNumberOfTeachers(),
            'classroomLogo' => $user->getClassroomLogo(),
            'lessons' => $lessons,
            'storageItems' => $storageItems,
        ];
    }

    /**
     * @param Lesson $lesson
     *
     * @return array
     */
    protected function convertLessonToArray(Lesson $lesson)
    {
        $userLessonTokens = array_map(function (UserLessonToken $userLessonToken) {
            return $userLessonToken->getToken();
        }, $lesson->getUserLessonTokens()->getValues());

        return [
            'title' => $lesson->getTitle(),
            'date' => $lesson->getDate()->format('Y-m-d'),
            'time' => $lesson->getTime(),
            'utcStartDateTimeStamp' => $lesson->getUTCStartDateTimeStamp(),
            'linkId' => $lesson->getLinkId(),
            'numberOfInvitedUsers' => $lesson->getNumberOfInvitedUsers(),
            'started' => $lesson->getStarted(),
            'finished' => $lesson->getFinished(),
            'lessonRecord' => $lesson->getLessonRecord(),
            'isDemoLesson' => $lesson->getIsDemoLesson(),
            'durationHours' => $lesson->getDurationHours(),
            'durationMinutes' => $lesson->getDurationMinutes(),
            'lessonCode' => $lesson->getLessonCode(),
            'userLessonTokens' => $userLessonTokens,
        ];
    }

    /**
     * @param StorageItem $storageItem
     *
     * @return array
     */
    protected function convertStorageItemToArray(StorageItem $storageItem)
    {
        $result = [
            'name' => $storageItem->getName(),
            'filePath' => $storageItem->getFilePath(),
            'type' => $storageItem->getType(),
            'createdAt' => $this->formatDate($storageItem->getCreatedAt()),
            'updatedAt' => $this->formatDate($storageItem->getUpdatedAt()),
            'slug' => $storageItem->getSlug(),
        ];

        if ($storageItem->getType() === StorageItem::TYPE_FOLDER) {
            $result['files'] = array_map(function (StorageItem $file) {
                return $this->convertStorageItemToArray($file);
            }, $storageItem->getFiles()->getValues());
        }

        return $result;
    }

    /**
     * @param \DateTime|null $date
     *
     * @return string
     */
    protected function formatDate($date)
    {
        return $date ? $date->format('Y-m-d H:i:s') : null;
    }
}
