<?php

namespace UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="UserBundle\Entity\Repository\ConsultantRepository")
 * @ORM\Table(name="consultants")
 */
class Consultant extends User
{

}
