<?php

namespace StorageBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * StorageItem
 *
 * @ORM\Table(name="storage_item")
 * @ORM\Entity(repositoryClass="StorageBundle\Repository\StorageItemRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class StorageItem
{
    const TYPE_FOLDER = 1;
    const TYPE_FILE = 2;

    public function __construct()
    {
        $this->files = new ArrayCollection();
    }

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text")
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="itemKey", type="text", nullable=true)
     */
    private $itemKey;

    /**
     * @return string
     */
    public function getItemKey()
    {
        return $this->itemKey;
    }

    /**
     * @return string
     */
    public function getFullItemKey()
    {
        return $this->itemKey !== null
            ? $this->itemKey . '.' . $this->id
            : $this->id;
    }

    /**
     * @param string $itemKey
     */
    public function setItemKey($itemKey)
    {
        $this->itemKey = $itemKey;
    }

    /**
     * @var string
     *
     * @ORM\Column(name="filePath", type="text", nullable=true)
     */
    private $filePath;

    /**
     * @var int
     *
     * @ORM\Column(name="type", type="integer")
     */
    private $type;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updatedAt", type="datetime")
     */
    private $updatedAt;

    /**
     * @var string
     * @Gedmo\Slug(fields={"name"})
     * @ORM\Column(name="slug", type="string", length=255, unique=true)
     */
    private $slug;

    /**
     * @param string $slug
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

    /**
     * @ORM\OneToMany(targetEntity="StorageItem", mappedBy="folder")
     */
    private $files;

    /**
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", nullable=true)
     */
    protected $user;

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     *
     * @return StorageItem
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getFiles()
    {
        return $this->files;
    }

    /**
     * @param mixed $files
     */
    public function setFiles($files)
    {
        $this->files = $files;
    }

    /**
     * @return StorageItem
     */
    public function getFolder()
    {
        return $this->folder;
    }

    /**
     * @param mixed $folder
     *
     * @return StorageItem
     */
    public function setFolder($folder)
    {
        $this->folder = $folder;

        return $this;
    }

    /**
     * @var StorageItem
     *
     * @ORM\ManyToOne(targetEntity="StorageItem", inversedBy="files")
     * @ORM\JoinColumn(name="folder_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $folder;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return StorageItem
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set filePath
     *
     * @param string $filePath
     * @return StorageItem
     */
    public function setFilePath($filePath)
    {
        $this->filePath = $filePath;

        return $this;
    }

    /**
     * Get filePath
     *
     * @return string
     */
    public function getFilePath()
    {
        return $this->filePath;
    }

    /**
     * Set type
     *
     * @param integer $type
     * @return StorageItem
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return integer
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param \DateTime $createdAt
     *
     * @return StorageItem
     */
    public function setCreatedAt(\DateTime $createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $updatedAt
     *
     * @return StorageItem
     */
    public function setUpdatedAt(\DateTime $updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    public function isFile()
    {
        return $this->type === StorageItem::TYPE_FILE;
    }

    public function toDTO($url)
    {
        return [
            'id' => $this->getId(),
            'type' => $this->type,
            'name' => $this->name,
            'filePath' => $this->filePath,
            'parentId' => $this->getFolder() != null ? $this->getFolder()->getId() : null,
            'downloadUrl' => $url
        ];
    }

    /**
     * @return StorageItem
     *
     * @ORM\PrePersist()
     */
    public function initDates()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();

        return $this;
    }

    /**
     * @return StorageItem
     *
     * @ORM\PreUpdate()
     */
    public function renewUpdatedAt()
    {
        $this->updatedAt = new \DateTime();

        return $this;
    }
}
