<?php

namespace UserBundle\Entity;

use AdminBundle\Entity\CustomizationInterface;
use AdminBundle\Entity\CustomizationTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use UserBundle\Validator\Constraints as UserAssert;

/**
 * @ORM\Entity(repositoryClass="UserBundle\Entity\Repository\ResellerRepository")
 * @ORM\Table(name="resellers")
 *
 * @UserAssert\UniqueExternalDomain(
 *     groups={"ResellerRegistration"}
 * )
 */
class Reseller extends User implements CustomizationInterface
{
    use CustomizationTrait;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="UserBundle\Entity\User", mappedBy="reseller", cascade={"remove"})
     */
    protected $users;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     *
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z0-9\-]{1,60}\.[a-zA-Z]{2,}$/",
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $externalDomain;

    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     *
     * @Assert\Range(
     *     min="1",
     *     groups={"ResellerRegistration"}
     * )
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $maximumUsers;

    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     *
     * @Assert\Range(
     *     min="0",
     *     groups={"ResellerRegistration"}
     * )
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $maximumPaidUsers;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    protected $codeForDnsChallenge;

    /**
     * @var bool
     */
    protected $hasCertificate;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $allowSubdomains;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     * @Assert\Email(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $mailgunSenderEmail;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $mailgunSenderName;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $mailgunDomain;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     */
    protected $mailgunApiKey;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $jivochatCode;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $jivochatEnabled;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $apiEnabled;

    public function __construct()
    {
        parent::__construct();

        $this->setRoles(['ROLE_RESELLER', 'ROLE_ALLOWED_TO_SWITCH']);
        $this->users = new ArrayCollection();
        $this->allowSubdomains = false;
        $this->jivochatEnabled = false;
        $this->apiEnabled = false;
    }

    /**
     * @return ArrayCollection
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param User $user
     *
     * @return Reseller
     */
    public function addUsers(User $user)
    {
        $this->users[] = $user;

        return $this;
    }

    /**
     * @param User $user
     */
    public function removeUsers(User $user)
    {
        $this->users->removeElement($user);
    }

    /**
     * @return string
     */
    public function getExternalDomain()
    {
        return $this->externalDomain;
    }

    /**
     * @param string $externalDomain
     *
     * @return Reseller
     */
    public function setExternalDomain($externalDomain)
    {
        $this->externalDomain = $externalDomain;

        return $this;
    }

    /**
     * @return int
     */
    public function getMaximumUsers()
    {
        return $this->maximumUsers;
    }

    /**
     * @param int $maximumUsers
     *
     * @return Reseller
     */
    public function setMaximumUsers($maximumUsers)
    {
        $this->maximumUsers = $maximumUsers;

        return $this;
    }

    /**
     * @return int
     */
    public function getMaximumPaidUsers()
    {
        return $this->maximumPaidUsers;
    }

    /**
     * @param int $maximumPaidUsers
     *
     * @return Reseller
     */
    public function setMaximumPaidUsers($maximumPaidUsers)
    {
        $this->maximumPaidUsers = $maximumPaidUsers;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getActiveTeachers()
    {
        return $this->users->filter(function (User $user) {
            return $user->isEnabled() && $user->hasRole('ROLE_TEACHER');
        });
    }

    /**
     * @return int
     */
    public function countTeachers()
    {
        return array_reduce($this->getActiveTeachers()->getValues(), function ($result, User $user) {
            $result += 1 + $user->countTeachers();

            return $result;
        }, 0);
    }

    /**
     * @return int
     */
    public function countPaidTeachers()
    {
        return $this->users->filter(function (User $user) {
            return $user->isEnabled() && $user->hasPaidPlan();
        })->count();
    }

    /**
     * @return string
     */
    public function getCodeForDnsChallenge()
    {
        return $this->codeForDnsChallenge;
    }

    /**
     * @param string $codeForDnsChallenge
     *
     * @return Reseller
     */
    public function setCodeForDnsChallenge($codeForDnsChallenge)
    {
        $this->codeForDnsChallenge = $codeForDnsChallenge;

        return $this;
    }

    /**
     * @return Reseller
     */
    public function clearCodeForDnsChallenge()
    {
        $this->codeForDnsChallenge = null;

        return $this;
    }

    /**
     * @return bool
     */
    public function getHasCertificate()
    {
        return $this->hasCertificate;
    }

    /**
     * @param bool $hasCertificate
     *
     * @return Reseller
     */
    public function setHasCertificate($hasCertificate)
    {
        $this->hasCertificate = $hasCertificate;

        return $this;
    }

    /**
     * @return bool
     */
    public function isAllowSubdomains()
    {
        return $this->allowSubdomains;
    }

    /**
     * @param bool $allowSubdomains
     *
     * @return Reseller
     */
    public function setAllowSubdomains($allowSubdomains)
    {
        $this->allowSubdomains = $allowSubdomains;

        return $this;
    }

    /**
     * @return string
     */
    public function getMailgunSenderEmail()
    {
        return $this->mailgunSenderEmail;
    }

    /**
     * @param string $mailgunSenderEmail
     *
     * @return Reseller
     */
    public function setMailgunSenderEmail($mailgunSenderEmail)
    {
        $this->mailgunSenderEmail = $mailgunSenderEmail;

        return $this;
    }

    /**
     * @return string
     */
    public function getMailgunSenderName()
    {
        return $this->mailgunSenderName;
    }

    /**
     * @param string $mailgunSenderName
     *
     * @return Reseller
     */
    public function setMailgunSenderName($mailgunSenderName)
    {
        $this->mailgunSenderName = $mailgunSenderName;

        return $this;
    }

    /**
     * @return string
     */
    public function getMailgunDomain()
    {
        return $this->mailgunDomain;
    }

    /**
     * @param string $mailgunDomain
     *
     * @return Reseller
     */
    public function setMailgunDomain($mailgunDomain)
    {
        $this->mailgunDomain = $mailgunDomain;

        return $this;
    }

    /**
     * @return string
     */
    public function getMailgunApiKey()
    {
        return $this->mailgunApiKey;
    }

    /**
     * @param string $mailgunApiKey
     *
     * @return Reseller
     */
    public function setMailgunApiKey($mailgunApiKey)
    {
        $this->mailgunApiKey = $mailgunApiKey;

        return $this;
    }

    /**
     * @return string
     */
    public function getJivochatCode()
    {
        return $this->jivochatCode;
    }

    /**
     * @param string $jivochatCode
     *
     * @return Reseller
     */
    public function setJivochatCode($jivochatCode)
    {
        $this->jivochatCode = $jivochatCode;

        return $this;
    }

    /**
     * @return bool
     */
    public function isJivochatEnabled()
    {
        return $this->jivochatEnabled;
    }

    /**
     * @param bool $jivochatEnabled
     *
     * @return Reseller
     */
    public function setJivochatEnabled($jivochatEnabled)
    {
        $this->jivochatEnabled = $jivochatEnabled;

        return $this;
    }

    /**
     * @return bool
     */
    public function isExceededPaidTeachers()
    {
        return $this->countPaidTeachers() >= $this->getMaximumPaidUsers();
    }

    /**
     * @return bool
     */
    public function isApiEnabled()
    {
        return $this->apiEnabled;
    }

    /**
     * @param bool $apiEnabled
     *
     * @return Reseller
     */
    public function setApiEnabled($apiEnabled)
    {
        $this->apiEnabled = $apiEnabled;

        return $this;
    }
}
